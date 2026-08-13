import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import FilterPanel from '../components/FilterPanel';
import usePagedProducts from '../hooks/usePagedProducts';
import { CATEGORY_SLUGS } from '../config';
import SEO_META from '../data/seo';
import { getCategoryDescription } from '../data/categories';
import { fetchProductsByCategory, filtersToProductParams } from '../lib/woo';
import { IMAGERY } from '../data/imagery';
import './shop.css';

const SEO_BY_CATEGORY = {
  [CATEGORY_SLUGS.rebornDolls]: SEO_META.rebornDolls,
  [CATEGORY_SLUGS.prams]: SEO_META.prams,
  [CATEGORY_SLUGS.furniture]: SEO_META.furniture,
  [CATEGORY_SLUGS.accessories]: SEO_META.accessories,
};

const TITLE_BY_CATEGORY = {
  [CATEGORY_SLUGS.rebornDolls]: 'Reborn Dolls',
  [CATEGORY_SLUGS.prams]: 'Doll Prams & Pushchairs',
  [CATEGORY_SLUGS.furniture]: 'Doll Furniture',
  [CATEGORY_SLUGS.accessories]: 'Doll Accessories',
};

const IMAGE_BY_CATEGORY = {
  [CATEGORY_SLUGS.rebornDolls]: IMAGERY.banners['reborn-dolls'],
  [CATEGORY_SLUGS.prams]: IMAGERY.banners['doll-prams-and-pushchairs'],
  [CATEGORY_SLUGS.furniture]: IMAGERY.banners['doll-furniture'],
  [CATEGORY_SLUGS.accessories]: IMAGERY.banners['doll-accessories'],
};

const TOP_IMAGE_CATEGORIES = new Set([CATEGORY_SLUGS.prams, CATEGORY_SLUGS.furniture]);

const PER_PAGE = 24;

const DEFAULT_FILTERS = {
  search: '',
  sort: 'date-desc',
  brand: '',
  minPrice: '',
  maxPrice: '',
  onSale: false,
};

export default function Shop() {
  const { category } = useParams();
  const description = getCategoryDescription(category);
  const meta = SEO_BY_CATEGORY[category];
  const heading = TITLE_BY_CATEGORY[category];
  const image = IMAGE_BY_CATEGORY[category];

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [layout, setLayout] = useState('grid');
  const sentinelRef = useRef(null);

  const queryParams = useMemo(() => filtersToProductParams(filters), [filters]);

  const { products, loading, loadingMore, error, total, hasMore, loadMore } = usePagedProducts({
    fetcher: (opts) => fetchProductsByCategory(category, opts),
    params: queryParams,
    resetKey: category,
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="page container">
      {meta && <SEO {...meta} />}

      <div className={`shop-banner${TOP_IMAGE_CATEGORIES.has(category) ? ' shop-banner--top' : ''}`}>
        {image && (
          <div className="shop-banner__media">
            <img src={image} alt="" aria-hidden="true" loading="lazy" />
            <div className="shop-banner__shade" aria-hidden="true" />
          </div>
        )}
        <div className="shop-banner__content">
          <p className="page__eyebrow shop-banner__eyebrow">Shop</p>
          <h1 className="shop-banner__title">{heading || category}</h1>
        </div>
      </div>

      {description && (
        <div className="shop__intro reading">
          <p className="shop__intro-lead">{description.intro}</p>
          <p>{description.body}</p>
        </div>
      )}

      {!description && !TITLE_BY_CATEGORY[category] && (
        <p className="status-note">
          We could not find that category. Try one of the collections above instead.
        </p>
      )}

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
        <div className="shop-toolbar__seg" role="group" aria-label="Layout">
          <button
            type="button"
            className={layout === 'grid' ? 'is-active' : ''}
            onClick={() => setLayout('grid')}
            aria-pressed={layout === 'grid'}
            title="Grid view"
          >
            Grid
          </button>
          <button
            type="button"
            className={layout === 'list' ? 'is-active' : ''}
            onClick={() => setLayout('list')}
            aria-pressed={layout === 'list'}
            title="List view"
          >
            List
          </button>
        </div>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        layout={layout}
      />

      {!loading && !error && hasMore && <div className="shop__sentinel" ref={sentinelRef} />}
      {!loading && !error && loadingMore && (
        <p className="shop__more">Gently fetching a little more&hellip;</p>
      )}
      {!loading && !error && !hasMore && products && products.length > 0 && (
        <p className="shop__more shop__more--end">You have seen everything on this shelf.</p>
      )}
    </div>
  );
}
