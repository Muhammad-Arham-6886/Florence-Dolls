# Florence Dolls — Storefront

Frontend-only React + Vite storefront for **Florence Dolls** (`florencedolls.co.uk`), a UK retailer of reborn baby dolls (Arias & Llorens). This is a standalone app — it does **not** use WordPress theme/Elementor content.

## Stack

- React 18 + Vite
- React Router (pages)
- react-helmet-async (per-page meta)
- Plain `fetch` against the **public** WooCommerce Store API (`/wp-json/wc/store/v1`) — no API keys exposed in the browser.

## Getting started

```bash
npm install
cp .env.example .env   # already created for you
npm run dev            # http://localhost:3000
npm run build          # production build -> dist/
```

Environment variables (edit `.env`):

| Variable | Purpose |
| --- | --- |
| `VITE_WP_REST_URL` | WooCommerce/WordPress `wp-json` origin. Use `/wp-json` for local dev with the Vite proxy, or the full site URL for production. |
| `VITE_WP_REST_USER` | WordPress username for authenticated REST endpoints (application password support). |
| `VITE_WP_REST_PASSWORD` | WordPress application password. Do not commit this secret. |
| `VITE_SITE_URL` | Canonical public domain used in meta tags, footer links and the checkout redirect target. |

## Decisions confirmed with the client

- **Data source:** public WooCommerce Store API (GraphQL plugins are not installed). All product/category/brand/new/sale data is live and unauthenticated.
- **Checkout:** handed off to the native WordPress checkout/cart for payment (no cart/checkout GraphQL available). The product "Add to Basket" links to the WP add-to-cart URL; `/cart` and `/checkout` routes redirect to the WordPress origin.
- **Brand pages:** brand lives inside product *names* (`Arias …`, `Llorens Dolls …`), not a `pa_brand` attribute, so brand routes filter by name search.
- **Blog:** pulled live from WordPress posts (`/wp/v2/posts`).
- **Contact & trade forms:** compose a `mailto:` to `info@florencedolls.co.uk` (no backend form handler needed).
- **Prams slug:** kept as the real, indexed category slug `doll-prams-and-pushchairs` (rather than the spec's `doll-prams-pushchairs`) to avoid breaking existing URLs.

## Structure

```
src/
  config.js            # brand/business facts + category + brand map
  lib/woo.js           # data layer (products, categories, brand, posts, price helpers)
  data/seo.js          # per-route meta titles/descriptions
  data/categories.js   # original category description copy
  components/          # Header, Footer, Layout, ProductCard, ProductGrid, SEO, ScrollToTop
  pages/               # one file per route (static & dynamic)
  styles/index.css     # design tokens (CSS custom properties) + base styles
```

## Design tokens (CSS custom properties)

Defined in `src/styles/index.css` under `:root` and referenced everywhere (never hardcoded):
`--color-primary` #42644B (deep evergreen) · `--color-secondary` #8A9A7E (olive sage) · `--color-accent` #D4A24C (soft gold) · `--color-background` #FAF6F1 (warm ivory) · `--color-text` #2E2A26 · `--color-heading` #33463A. Fonts: Playfair Display (headings) + Lato (body) from Google Fonts.

## Image note

Product photography comes **live from WooCommerce** (no third-party images imported). Original hero / lifestyle (rebranded) imagery is **not yet supplied** — placeholders fall back to the product image or a styled placeholder where expected.

## Deploying to production

When the domain goes live: update `VITE_WP_REST_URL` and `VITE_SITE_URL` in `.env` and rebuild. No code changes required.