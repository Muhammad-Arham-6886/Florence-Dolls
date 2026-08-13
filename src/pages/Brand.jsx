import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import FilterPanel from '../components/FilterPanel';
import usePagedProducts from '../hooks/usePagedProducts';
import { BRANDS } from '../config';
import SEO_META from '../data/seo';
import { fetchProductsByBrand, filtersToProductParams } from '../lib/woo';
import './shop.css';

const brandCopy = {
  arias: {
    title: 'The Arias Collection',
    intro:
      'Arias has spent decades folding a certain quiet brilliance into every one of its dolls \u2014 soft fingers, a weight that sits right, faces that ask to be loved. We are glad to keep a genuine Arias range, held here in the UK and chosen as a family would choose it.',
    body:
      'Because arias pieces are made to be passed on rather than outgrown, they suit collectors and first-time families alike. Every doll we list is verified stock, and everything leaves us carefully packed within our 2\u20133 day window.',
    meta: SEO_META.brandArias,
  },
llorens: {
    title: 'The Llorens Collection',
    intro:
      'From gentle companions to the widely loved crying babies, Llorens has been a steady presence in the doll world for generations \u2014 and a warmly human one. Our Llorens range is kept close to home, ready to be loved.',
    text:
      'Llorens finds its home in gentle play and fond memories. We source only genuine Llorens pieces \u2014 dolls, carrycots and accessories \u2014 checked and kept in the UK, then posted out with the same quick, careful delivery we give every Florence parcel.',
    meta: SEO_META.brandLlorens,
  },
};

const DEFAULT_FILTERS = {
  search: '',
  sort: 'date-desc',
  brand: '',
  minPrice: '',
  maxPrice: '',
  onSale: false,
};

export default function Brand() {
  const { brand } = useParams();
  const brandInfo = BRANDS.find((b) => b.slug === brand);
  const content = brandCopy[brand];

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const queryParams = useMemo(() => filtersToProductParams(filters), [filters]);

  const { products, loading, loadingMore, error, total, hasMore, loadMore } = usePagedProducts({
    fetcher: (opts) => fetchProductsByBrand(brandInfo ? brandInfo.search : '', opts),
    params: queryParams,
    resetKey: brand,
  });

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="page container">
      {brandInfo && content && content.meta && <SEO {...content.meta} />}
      {!brandInfo && <SEO title="Collection" description="A Florence Dolls collection." />}

      {brandInfo && content ? (
        <>
          <p className="page__eyebrow">The {brandInfo.name} Collection</p>
          <h1 className="shop__title">{content.title}</h1>
          <div className="shop__intro reading">
            <p className="shop__intro-lead">{content.intro}</p>
            <p>{content.body || content.text}</p>
          </div>

          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            resultCount={total}
            loading={loading}
            hideBrand
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
        </>
      ) : (
        <div className="page">
          <p className="status-note">We could not find that brand here. You might try the Arias or Llorens collections.</p>
        </div>
      )}
    </div>
  );
}
