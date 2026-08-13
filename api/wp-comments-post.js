// Vercel serverless proxy for the WordPress guest-review endpoint. WordPress
// answers with a 302 when the review is accepted (held for moderation) and
// dies in place (200) on validation failure, so we translate that into JSON.
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

  const ct = reqHeaders['content-type'] || 'application/x-www-form-urlencoded';
  const isBodyMethod = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH';
  let bodyStr = '';
  if (isBodyMethod) {
    if (typeof req.body === 'string') {
      bodyStr = req.body;
    } else if (ct.toLowerCase().includes('application/json')) {
      bodyStr = JSON.stringify(req.body || {});
    } else {
      bodyStr = new URLSearchParams(req.body || {}).toString();
    }
  }

  try {
    const init = {
      method: req.method || 'POST',
      headers: { 'Content-Type': ct },
      redirect: 'manual',
    };
    if (isBodyMethod) init.body = bodyStr;
    const upstream = await fetch(`${WP_ORIGIN}/wp-comments-post.php`, init);
    const ok = upstream.status >= 300 && upstream.status < 400;
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    setCors(res);
    res.end(JSON.stringify({ ok }));
  } catch (err) {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    setCors(res);
    res.end(JSON.stringify({ ok: false, error: String(err.message || 'Proxy error') }));
  }
}

function setCors(res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'OPTIONS, GET, POST');
  res.setHeader('access-control-allow-headers', 'Accept, Authorization, Content-Type, Origin');
}
