// Central configuration for the Florence Dolls storefront.
// Data endpoints are consumed via the public WooCommerce Store API (wc/store/v1)
// so no API keys are exposed in the browser.

export const SITE = {
  brand: 'Florence Dolls',
  canonical: import.meta.env.VITE_SITE_URL || 'https://florencedolls.co.uk',
  email: 'info@florencedolls.co.uk',
  phone: '01274 400100',
  phoneIntl: '+441274400100',
  companyNo: '17166512',
  deliveryWindow: '2\u20133 working days',
  returnsWindow: '14 days',
};

export const WP_REST_USER = import.meta.env.VITE_WP_REST_USER || '';
export const WP_REST_PASSWORD = import.meta.env.VITE_WP_REST_PASSWORD || '';

export const WP_REST_URL =
  import.meta.env.VITE_WP_REST_URL || '/wp-json';

export const STORE_URL = `${WP_REST_URL}/wc/store/v1`;

export function getWpAuthHeaders() {
  if (!WP_REST_USER || !WP_REST_PASSWORD) return {};
  const token = btoa(`${WP_REST_USER}:${WP_REST_PASSWORD}`);
  return { Authorization: `Basic ${token}` };
}

// Category slugs as they exist in WooCommerce (verified against the live store).
export const CATEGORY_SLUGS = {
  rebornDolls: 'reborn-dolls',
  prams: 'doll-prams-and-pushchairs', // real slug; matches what the site indexes
  furniture: 'doll-furniture',
  accessories: 'doll-accessories',
  newArrivals: 'new-arrivals',
  sale: 'sales',
};

// Brand filtering is done by name search because brand is stored inside product
// names (e.g. "Arias ...", "Llorens Dolls ...") rather than as a global attribute.
export const BRANDS = [
  { slug: 'arias', name: 'Arias', search: 'Arias' },
  { slug: 'llorens', name: 'Llorens', search: 'Llorens' },
];