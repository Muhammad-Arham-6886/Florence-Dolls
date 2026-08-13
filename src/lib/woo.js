import { STORE_URL, WP_REST_URL, getWpAuthHeaders } from '../config';

// Decode HTML entities (e.g. "&amp;" -> "&", "&#8211;" -> "–") so names and
// titles render cleanly as plain text. Only used for text fields, never for
// content injected with dangerouslySetInnerHTML.
export function decodeHtml(input) {
  if (input == null) return input;
  if (typeof input !== 'string') return input;
  const txt = document.createElement('textarea');
  txt.innerHTML = input;
  return txt.value;
}

function decodeProduct(p) {
  if (!p || typeof p !== 'object') return p;
  const out = { ...p };
  if (typeof out.name === 'string') out.name = decodeHtml(out.name);
  if (Array.isArray(out.categories)) {
    out.categories = out.categories.map((c) =>
      c && typeof c === 'object' ? { ...c, name: decodeHtml(c.name) } : c
    );
  }
  if (Array.isArray(out.tags)) {
    out.tags = out.tags.map((t) => {
      if (typeof t === 'string') return decodeHtml(t);
      return t && typeof t === 'object' ? { ...t, name: decodeHtml(t.name) } : t;
    });
  }
  if (Array.isArray(out.attributes)) {
    out.attributes = out.attributes.map((a) => {
      if (!a || typeof a !== 'object') return a;
      const copy = { ...a, name: decodeHtml(a.name) };
      if (Array.isArray(a.terms)) {
        copy.terms = a.terms.map((t) => {
          if (typeof t === 'string') return decodeHtml(t);
          return t && typeof t === 'object' ? { ...t, name: decodeHtml(t.name) } : t;
        });
      }
      return copy;
    });
  }
  return out;
}

// Normalise WooCommerce product attributes into { name, values[] } rows.
export function buildAttributes(product) {
  if (!product || !Array.isArray(product.attributes)) return [];
  return product.attributes
    .filter((a) => a && typeof a.name === 'string' && a.name.trim())
    .map((a) => ({
      name: a.name,
      values: (Array.isArray(a.terms) ? a.terms : [])
        .map((t) => (t && typeof t === 'object' ? t.name : String(t)))
        .filter((v) => v && String(v).trim()),
    }))
    .filter((a) => a.values.length > 0);
}

function decodeItems(items) {
  return (Array.isArray(items) ? items : []).map(decodeProduct);
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, value);
    }
  });
  return qs.toString();
}

async function request(path, params) {
  const q = buildQuery(params);
  const url = `${STORE_URL}/${path}${q ? `?${q}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WooCommerce API ${res.status}: ${url}`);
  }
  return res.json();
}

async function wpRequest(path, params, { auth = false } = {}) {
  const q = buildQuery(params);
  const url = `${WP_REST_URL}/${path}${q ? `?${q}` : ''}`;
  const headers = auth ? getWpAuthHeaders() : {};
  const init = Object.keys(headers).length ? { headers, credentials: 'omit' } : { credentials: 'omit' };
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`WordPress API ${res.status}: ${url}`);
  }
  return res.json();
}

async function requestWithMeta(path, params) {
  const q = buildQuery(params);
  const url = `${STORE_URL}/${path}${q ? `?${q}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WooCommerce API ${res.status}: ${url}`);
  }
  const json = await res.json();
  return {
    items: decodeItems(json),
    total: Number(res.headers.get('X-WP-Total') || 0),
    totalPages: Number(res.headers.get('X-WP-TotalPages') || 1),
  };
}

// ---- Products ----

// Map FilterPanel state to Store API product query params.
export function filtersToProductParams(filters = {}) {
  const [key, dir] = (filters.sort || 'date-desc').split('-');
  let orderby = 'date';
  if (key === 'price') orderby = 'price';
  if (key === 'name') orderby = 'title';
  return {
    orderby,
    order: dir === 'asc' ? 'asc' : 'desc',
    search: filters.search || undefined,
    brand: filters.brand || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    onSale: filters.onSale,
  };
}

function productParams({
  page = 1,
  perPage = 24,
  orderby = 'date',
  order = 'desc',
  search,
  onSale,
  minPrice,
  maxPrice,
  brand,
} = {}) {
  const params = { page, per_page: perPage, orderby, order };
  if (onSale) params.on_sale = true;
  if (minPrice != null && minPrice !== '') params.min_price = Math.round(Number(minPrice) * 100);
  if (maxPrice != null && maxPrice !== '') params.max_price = Math.round(Number(maxPrice) * 100);
  const terms = [brand, search].filter((t) => t && String(t).trim()).join(' ');
  if (terms) params.search = terms;
  return params;
}

export function fetchProducts(params) {
  return request('products', { per_page: 24, ...params }).then(decodeItems);
}

export function fetchProduct(slug) {
  return request('products', { slug }).then(decodeItems);
}

let categoriesPromise = null;

export function getCategoriesCached() {
  if (!categoriesPromise) {
    categoriesPromise = fetchCategories().catch((err) => {
      categoriesPromise = null;
      throw err;
    });
  }
  return categoriesPromise;
}

export async function getCategoryIdBySlug(slug) {
  const cats = await getCategoriesCached();
  const found = cats.find((c) => c.slug === slug || c.slug.toLowerCase() === slug);
  return found ? found.id : null;
}

export async function fetchProductsByCategory(slug, opts = {}) {
  const categoryId = await getCategoryIdBySlug(slug);
  if (!categoryId) {
    return { items: [], total: 0, totalPages: 1 };
  }
  const params = productParams(opts);
  params.category = categoryId;
  return requestWithMeta('products', params);
}

export async function fetchProductsBySearch(search, page = 1, perPage = 24) {
  const result = await requestWithMeta('products', {
    page,
    per_page: perPage,
    search,
    orderby: 'date',
    order: 'desc',
  });
  return {
    items: result.items,
    total: result.total,
    totalPages: result.totalPages,
  };
}

export function fetchProductsOnSale(opts = {}) {
  return requestWithMeta('products', { ...productParams(opts), on_sale: true });
}

export function fetchNewArrivals(opts = {}) {
  return requestWithMeta('products', productParams(opts));
}

// ---- Categories ----

export function fetchCategories() {
  return request('products/categories', { per_page: 100 }).then((list) =>
    (Array.isArray(list) ? list : []).map((c) => ({ ...c, name: decodeHtml(c.name) }))
  );
}

// ---- Brand (name search) ----

export function fetchProductsByBrand(brand, opts = {}) {
  return requestWithMeta('products', productParams({ ...opts, brand }));
}

// ---- Single product detail ----

export async function fetchProductDetail(slug) {
  const items = await fetchProduct(slug);
  if (Array.isArray(items) && items.length > 0) return items[0];
  return null;
}

export async function fetchProductReviews(productId) {
  if (!productId) return [];
  try {
    const items = await request('products/reviews', { product: productId, per_page: 20 });
    return Array.isArray(items) ? items : [];
  } catch (err) {
    return [];
  }
}

// Submit a product review exactly as the WordPress site's own form does, by
// posting to wp-comments-post.php. On success WordPress responds with a
// redirect (reviews are held for moderation); on validation failure it dies
// in place (HTTP 200). We follow the redirect and treat "redirected" as the
// success signal, so cross-origin CORS (enable-cors plugin) is respected.
export async function submitProductReview({ productId, name, email, comment, rating }) {
  const origin = WP_REST_URL.replace(/\/wp-json$/, '');
  const body = new URLSearchParams({
    comment_post_ID: String(productId),
    comment_parent: '0',
    comment_type: 'review',
    author: name || '',
    email: email || '',
    comment: comment || '',
    rating: String(rating || 5),
  });
  const res = await fetch(`${origin}/wp-comments-post.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    redirect: 'follow',
    credentials: 'omit',
  });
  return { ok: res.redirected, url: res.url || '' };
}

// ---- Blog posts (WordPress core REST, public) ----

function normalizePost(raw) {
  const terms = raw._embedded && raw._embedded['wp:term'] ? raw._embedded['wp:term'] : [];
  const byTax = {};
  terms.forEach((group) => {
    if (Array.isArray(group)) {
      group.forEach((t) => {
        if (!byTax[t.taxonomy]) byTax[t.taxonomy] = [];
        byTax[t.taxonomy].push({ id: t.id, name: decodeHtml(t.name), slug: t.slug });
      });
    }
  });
  const media = raw._embedded && raw._embedded['wp:featuredmedia'];
  let image = null;
  if (Array.isArray(media) && media.length && media[0] && media[0].source_url) {
    image = media[0].source_url;
  }
  const seo = raw.yoast_head_json || {};
  return {
    id: raw.id,
    slug: raw.slug,
    title: decodeHtml(raw.title && raw.title.rendered),
    date: raw.date,
    excerpt: raw.excerpt && raw.excerpt.rendered,
    content: raw.content && raw.content.rendered,
    image,
    categories: byTax.category || [],
    tags: byTax.post_tag || [],
    seo: {
      title: seo.title || null,
      description: seo.description || null,
      focuskw: (raw.meta && raw.meta._yoast_wpseo_focuskw) || null,
    },
  };
}

export function fetchPosts(page = 1, perPage = 12) {
  return wpRequest('wp/v2/posts', {
    page,
    per_page: perPage,
    _embed: true,
    _fields:
      'id,slug,title,date,excerpt,content,categories,tags,meta,yoast_head_json,_links,_embedded',
  }).then((list) => ({
    items: (Array.isArray(list) ? list : []).map(normalizePost),
    page,
  }));
}

export function fetchPostBySlug(slug) {
  return wpRequest('wp/v2/posts', {
    slug,
    _embed: true,
    _fields:
      'id,slug,title,date,excerpt,content,categories,tags,meta,yoast_head_json,_links,_embedded',
  }).then((list) =>
    Array.isArray(list) && list.length ? normalizePost(list[0]) : null
  );
}

export function fetchCurrentWpUser() {
  return wpRequest('wp/v2/users/me', {}, { auth: true });
}

// ---- Currency / price formatting ----

export function formatPrice(prices) {
  if (!prices) return '';
  const amount = prices.price || prices.regular_price || '0';
  const symbol = prices.currency_symbol || '£';
  const prefix = prices.currency_prefix || '';
  const suffix = prices.currency_suffix || '';
  const value = (Number(amount) / (prices.currency_minor_unit || 2 === 2 ? 100 : 1)).toFixed(2);
  // Only use prefix or symbol, not both — prevent ££ double display
  const displayPrefix = prefix ? '' : symbol;
  const displaySymbol = prefix ? symbol : '';
  return `${displayPrefix}${displaySymbol}${value}${suffix}`.replace(/^\$\s*/, '');
}

export function formatTotal(total, prices) {
  const symbol = (prices && prices.currency_symbol) || '\u00A3';
  const prefix = (prices && prices.currency_prefix) || '';
  const suffix = (prices && prices.currency_suffix) || '';
  return `${prefix}${symbol}${total.toFixed(2)}${suffix}`.replace(/^\$\s*/, '');
}

export function isOnSale(product) {
  return Boolean(product && product.prices && product.prices.sale_price &&
    product.prices.sale_price !== product.prices.regular_price);
}

export function stockLabel(product) {
  if (!product) return '';
  const status = product.stock_status || '';
  if (status === 'instock' || status === 'in_stock' || status === '') {
    if (product.stock_quantity != null && product.stock_quantity > 0 && product.stock_quantity <= 5) {
      return `Only ${product.stock_quantity} left`;
    }
    return 'In stock';
  }
  if (status === 'outofstock' || status === 'out_of_stock') return 'Out of stock';
  if (status === 'onbackorder' || status === 'on_backorder') return 'Available to pre-order';
  return '';
}

// ---- Cart (WooCommerce Store API) ----
// The Store API keeps a guest cart behind a rotating Cart-Token header. Each
// mutation returns the full, authoritative cart body plus a fresh token, so we
// always adopt the response instead of trying to read the cart back via GET.

const CART_TOKEN_KEY = 'fd_wp_cart_token';

export function getCartToken() {
  try {
    return localStorage.getItem(CART_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

function setCartToken(token) {
  try {
    if (token) {
      localStorage.setItem(CART_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(CART_TOKEN_KEY);
    }
  } catch {
    /* storage unavailable */
  }
}

function slugFromPermalink(permalink) {
  if (!permalink) return '';
  const parts = String(permalink).replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || '';
}

export function normalizeCartItems(items = []) {
  return items.map((it) => ({
    key: it.key,
    id: it.id,
    slug: slugFromPermalink(it.permalink),
    name: decodeHtml(it.name),
    image: it.images && it.images[0] ? it.images[0].src : null,
    prices: it.prices || {},
    qty: it.quantity != null ? it.quantity : 1,
  }));
}

export function parseCart(json) {
  const items = normalizeCartItems(json && json.items);
  const totals = (json && json.totals) || {};
  const minor = totals.currency_minor_unit === 1 ? 1 : 100;
  return {
    items,
    count: json && json.items_count != null
      ? json.items_count
      : items.reduce((n, i) => n + i.qty, 0),
    total: totals.total_price != null ? Number(totals.total_price) / minor : null,
    currency: totals.currency_code || 'USD',
  };
}

async function cartRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (token) headers['Cart-Token'] = token;
  const init = { method, headers, credentials: 'omit' };
  if (body) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${STORE_URL}/cart${path}`, init);
  const nextToken = res.headers.get('Cart-Token') || token || null;
  if (!res.ok) {
    throw new Error(`WooCommerce cart API ${res.status}: ${path}`);
  }
  const json = await res.json();
  return { cart: parseCart(json), token: nextToken };
}

export async function initCart() {
  const stored = getCartToken();
  const result = await cartRequest('', { token: stored || undefined });
  if (result.token) setCartToken(result.token);
  return result;
}

export async function addCartItem(id, quantity, token) {
  const result = await cartRequest('/add-item', {
    method: 'POST',
    body: { id: String(id), quantity },
    token,
  });
  if (result.token) setCartToken(result.token);
  return result;
}

export async function updateCartItem(key, quantity, token) {
  const result = await cartRequest('/update-item', {
    method: 'POST',
    body: { key, quantity },
    token,
  });
  if (result.token) setCartToken(result.token);
  return result;
}

export async function removeCartItem(key, token) {
  const result = await cartRequest('/remove-item', {
    method: 'POST',
    body: { key },
    token,
  });
  if (result.token) setCartToken(result.token);
  return result;
}

export async function clearCartItems(token) {
  const result = await cartRequest('/items', {
    method: 'DELETE',
    token,
  });
  if (result.token) setCartToken(result.token);
  return result;
}

// ---- Checkout (WooCommerce Store API) ----
// These helpers work against the live Store API cart (the same Cart-Token used
// by the basket) so totals, shipping rates and the final order all come from
// WordPress. Errors preserve the Store API's { code, message, details } shape.

async function cartRequestRaw(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (token) headers['Cart-Token'] = token;
  const init = { method, headers, credentials: 'omit' };
  if (body) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${STORE_URL}/cart${path}`, init);
  const nextToken = res.headers.get('Cart-Token') || token || null;
  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((json && json.message) || `WooCommerce cart API ${res.status}`);
    err.code = (json && json.code) || res.status;
    err.details = (json && json.data && json.data.details) || null;
    err.status = res.status;
    throw err;
  }
  return { cart: json, token: nextToken };
}

// Read the authoritative live cart (items, totals, shipping packages).
export function fetchCheckoutCart(token) {
  return cartRequestRaw('', { token });
}

// Send billing/shipping addresses to WordPress so it can calculate delivery.
export function updateCheckoutCustomer(billingAddress, shippingAddress, token) {
  return cartRequestRaw('/update-customer', {
    method: 'POST',
    body: { billing_address: billingAddress, shipping_address: shippingAddress },
    token,
  });
}

// Select one of the rates WordPress returned for the address.
export function selectCheckoutShippingRate(rateId, token) {
  return cartRequestRaw('/select-shipping-rate', {
    method: 'POST',
    body: { rate_id: rateId },
    token,
  });
}

// Place the order. WordPress creates the order and returns its payment result.
export async function placeCheckoutOrder({ billingAddress, shippingAddress, paymentMethod, token }) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Cart-Token'] = token;
  const res = await fetch(`${STORE_URL}/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    }),
    credentials: 'omit',
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((json && json.message) || `WooCommerce checkout ${res.status}`);
    err.code = (json && json.code) || res.status;
    err.details = (json && json.data && json.data.details) || null;
    err.status = res.status;
    throw err;
  }
  return json;
}

// Flatten the Store API cart's shipping packages into a single rate list.
export function getShippingPackages(cart) {
  if (!cart || !Array.isArray(cart.shipping_rates)) return [];
  const out = [];
  cart.shipping_rates.forEach((pkg) => {
    if (pkg && Array.isArray(pkg.shipping_rates)) {
      pkg.shipping_rates.forEach((rate) =>
        out.push({ ...rate, package_id: pkg.package_id })
      );
    }
  });
  return out;
}

// Format a Store API amount (minor units, e.g. pence) using the cart's currency.
export function formatCartMoney(minorValue, totals) {
  const minor = totals && totals.currency_minor_unit === 1 ? 1 : 100;
  return formatTotal(Number(minorValue || 0) / minor, totals);
}

// Enabled payment gateways are read from WordPress (wc/v3, admin-authenticated).
// If no credentials are configured the storefront falls back to the standard
// retail offline methods so checkout always has a valid option.
export const FALLBACK_PAYMENT_METHODS = [
  {
    id: 'bacs',
    title: 'Direct bank transfer',
    description:
      'Make your payment directly into our bank account. Your order is confirmed once the funds arrive.',
  },
  {
    id: 'cod',
    title: 'Cash on delivery',
    description: 'Pay in cash when your order is delivered to your door.',
  },
];

export async function fetchPaymentMethods() {
  const headers = getWpAuthHeaders();
  if (!headers.Authorization) return FALLBACK_PAYMENT_METHODS;
  try {
    const res = await fetch(`${WP_REST_URL}/wc/v3/payment_gateways?per_page=100`, {
      headers,
      credentials: 'omit',
    });
    if (!res.ok) return FALLBACK_PAYMENT_METHODS;
    const list = await res.json();
    const enabled = (Array.isArray(list) ? list : []).filter(
      (g) => g && g.enabled && String(g.enabled) !== 'no'
    );
    if (!enabled.length) return FALLBACK_PAYMENT_METHODS;
    return enabled.map((g) => ({
      id: g.id,
      title: decodeHtml(g.title) || g.id,
      description: g.description || '',
    }));
  } catch {
    return FALLBACK_PAYMENT_METHODS;
  }
}