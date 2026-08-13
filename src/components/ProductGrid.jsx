import ProductCard from './ProductCard';
import './product-grid.css';

export default function ProductGrid({ products, loading, error, empty, layout = 'grid' }) {
  if (loading) {
    return (
      <div className="product-grid product-grid--status">
        <p className="status-note">Gently fetching the latest from our shelves&hellip;</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid product-grid--status">
        <p className="status-note status-note--error">
          We could not reach the shelves right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid product-grid--status">
        <p className="status-note">{empty || 'Nothing is here just yet, but fresh pieces are always on the way.'}</p>
      </div>
    );
  }

  return (
    <div className={`product-grid product-grid--${layout}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout={layout} />
      ))}
    </div>
  );
}
