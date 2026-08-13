import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import FilterPanel from '../components/FilterPanel';
import usePagedProducts from '../hooks/usePagedProducts';
import SEO_META from '../data/seo';
import { fetchProductsOnSale, filtersToProductParams } from '../lib/woo';
import { IMAGERY } from '../data/imagery';
import './shop.css';

const DEFAULT_FILTERS = {
  search: '',
  sort: 'date-desc',
  brand: '',
  minPrice: '',
  maxPrice: '',
  onSale: false,
};

export default function Sale() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const queryParams = useMemo(() => filtersToProductParams(filters), [filters]);

  const { products, loading, loadingMore, error, total, hasMore, loadMore } = usePagedProducts({
    fetcher: fetchProductsOnSale,
    params: queryParams,
  });

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="page container">
      <SEO {...SEO_META.sale} />

      <div className="shop-banner">
        <div className="shop-banner__media">
          <img src={IMAGERY.banners.sale} alt="" aria-hidden="true" loading="lazy" />
          <div className="shop-banner__shade" aria-hidden="true" />
        </div>
        <div className="shop-banner__content">
          <p className="page__eyebrow shop-banner__eyebrow">A moment of lower prices</p>
          <h1 className="shop-banner__title">Sale &amp; Special Offers</h1>
        </div>
      </div>

      <div className="shop__intro reading">
        <p className="shop__intro-lead">
          From time to time we make room on the shelf &mdash; and a few genuine pieces find a kinder price. Look for the amber tag across the shop; every reduced item is still held in UK stock and posted with our usual care.
        </p>
        <p>
          Discounts here are always true ones, never a prettied-up number. When a piece has a new lower price, you will see the original beside it. Once sale stock is gone we rarely restock it, so if it catches your eye, move when you are ready.
        </p>
      </div>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={total}
        loading={loading}
        hideOnSale
      />

      <div className="shop__count">
        <span className="shop__count-line" aria-hidden="true" />
        <span className="shop__count-text">
          {loading ? 'From our shelves' : `${total} piece${total === 1 ? '' : 's'}`}
        </span>
      </div>

      <ProductGrid products={products} loading={loading} error={error} empty={'Nothing is on sale just now \u2014 do come back soon.'} />

      {!loading && !error && hasMore && (
        <p className="shop__more">
          <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Gently fetching a little more\u2026' : 'Show more'}
          </button>
        </p>
      )}
      {!loading && !error && !hasMore && products && products.length > 0 && (
        <p className="shop__more shop__more--end">You have seen everything on this shelf.</p>
      )}
    </div>
  );
}
