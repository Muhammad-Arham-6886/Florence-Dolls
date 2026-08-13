// Vercel serverless proxy: forwards /wp-json/* to the WooCommerce origin.
// Keeps the storefront same-origin so browser CORS is never involved, and lets
// the WordPress app password stay server-side via WP_REST_USER/WP_REST_PASSWORD.
// Static function name (api/wp-json.js) because Vercel did not register the
// [...] catch-all file; the API path arrives in the ?path= query param.
const WP_ORIGIN = process.env.WP_ORIGIN || 'https://thelondonhub.co.uk/florencedolls';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    setCors(res);
    res.end();
    return;
  }

  const reqHeaders = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    reqHeaders[key.toLowerCase()] = value;
  }

  const pathParam = req.query.path;
  const apiPath = Array.isArray(pathParam)
    ? pathParam.join('/')
    : typeof pathParam === 'string'
      ? pathParam
      : '';

  const qs = Object.entries(req.query)
    .filter(([key]) => key !== 'path')
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(
        Array.isArray(value) ? value.join(',') : value
      )}`
    )
    .join('&');

  const url = `${WP_ORIGIN}/wp-json/${apiPath}${qs ? `?${qs}` : ''}`;

  const headers = {};
  const ct = reqHeaders['content-type'];
  if (ct) headers['Content-Type'] = ct;
  ['cart-token', 'cart-hash', 'nonce', 'nonce-timestamp', 'authorization'].forEach((name) => {
    if (reqHeaders[name]) headers[name] = reqHeaders[name];
  });

  const wpUser = process.env.WP_REST_USER;
  const wpPassword = process.env.WP_REST_PASSWORD;
  if (wpUser && wpPassword) {
    headers['Authorization'] =
      'Basic ' + Buffer.from(`${wpUser}:${wpPassword}`).toString('base64');
  }

  const init = { method: req.method || 'GET', headers, redirect: 'manual' };
  const hasBody = req.body != null && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (hasBody) {
    const type = (ct || '').toLowerCase();
    init.body =
      typeof req.body === 'string'
        ? req.body
        : type.includes('application/x-www-form-urlencoded')
          ? new URLSearchParams(req.body || {}).toString()
          : JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(url, init);
    const text = await upstream.text();

    res.statusCode = upstream.status;
    setCors(res);
    [
      'content-type',
      'x-wp-total',
      'x-wp-totalpages',
      'link',
      'allow',
      'cart-token',
      'cart-hash',
      'nonce',
      'nonce-timestamp',
    ].forEach((name) => {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    });
    res.setHeader('cache-control', 'no-store');
    res.end(text);
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    setCors(res);
    res.end(JSON.stringify({ code: 'proxy_error', message: String(err.message || 'Proxy error') }));
  }
}

function setCors(res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('access-control-allow-headers', 'Accept, Authorization, Content-Type, Origin, Cart-Token, Cart-Hash, Nonce, Nonce-Timestamp');
  res.setHeader('access-control-expose-headers', 'X-WP-Total, X-WP-TotalPages, Link, Cart-Token, Cart-Hash, Nonce, Nonce-Timestamp');
}
