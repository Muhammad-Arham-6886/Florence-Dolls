import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import { fetchProductsBySearch } from '../lib/woo';
import './search.css';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(false);
    fetchProductsBySearch(query.trim())
      .then((res) => {
        if (!cancelled) {
          setProducts(res.items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const onSearch = (e) => {
    e.preventDefault();
    const value = e.target.elements.q.value.trim();
    if (value) setParams({ q: value });
  };

  return (
    <div className="page container">
      <SEO
        path={query ? `/search?q=${encodeURIComponent(query)}` : '/search'}
        title={query ? `Search: ${query}` : 'Search'}
        description="Search the Florence Dolls shelves for reborn dolls, prams, furniture and accessories."
      />

      <p className="page__eyebrow">Search</p>
      <h1 className="page__title">{query ? `Results for \u201c${query}\u201d` : 'Search the shop'}</h1>

      <form className="search-page__form" onSubmit={onSearch}>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search reborn dolls, prams, furniture..."
          aria-label="Search the shop"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {query && (
        <div className="shop__count">
          <span className="shop__count-line" aria-hidden="true" />
          <span className="shop__count-text">
            {loading
              ? 'Searching our shelves\u2026'
              : products
                ? `${products.length} result${products.length === 1 ? '' : 's'}`
                : ''}
          </span>
        </div>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        empty={query ? `No pieces match \u201c${query}\u201d right now. Try another word, or browse new arrivals.` : 'Type a word above to search our shelves.'}
      />
    </div>
  );
}