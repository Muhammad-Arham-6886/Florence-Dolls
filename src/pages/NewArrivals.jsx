import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import FilterPanel from '../components/FilterPanel';
import usePagedProducts from '../hooks/usePagedProducts';
import SEO_META from '../data/seo';
import { fetchNewArrivals, filtersToProductParams } from '../lib/woo';
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

export default function NewArrivals() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const queryParams = useMemo(() => filtersToProductParams(filters), [filters]);

  const { products, loading, loadingMore, error, total, hasMore, loadMore } = usePagedProducts({
    fetcher: fetchNewArrivals,
    params: queryParams,
  });

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="page container">
      <SEO {...SEO_META.newArrivals} />

      <div className="shop-banner">
        <div className="shop-banner__media">
          <img src={IMAGERY.banners['new-arrivals']} alt="" aria-hidden="true" loading="lazy" />
          <div className="shop-banner__shade" aria-hidden="true" />
        </div>
        <div className="shop-banner__content">
          <p className="page__eyebrow shop-banner__eyebrow">Fresh in the house</p>
          <h1 className="shop-banner__title">New Arrivals</h1>
        </div>
      </div>

      <div className="shop__intro reading">
        <p className="shop__intro-lead">
          The newest pieces at Florence Dolls, gently set down the moment they arrive. If you are drawn to something here, it is worth being timely &mdash; fresh stock tends to find a home quickly.
        </p>
        <p>
          We add new reborn dolls, Arias and Llorens finds, prams and accessories the moment we have checked and photographed them. Everything is held in UK stock, so a piece you love today can be with you within our usual delivery time.
        </p>
      </div>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={total}
        loading={loading}
      />

      <div className="shop__count">
        <span className="shop__count-line" aria-hidden="true" />
        <span className="shop__count-text">
          {loading ? 'From our shelves' : `${total} piece${total === 1 ? '' : 's'}`}
        </span>
      </div>

      <ProductGrid products={products} loading={loading} error={error} />

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
