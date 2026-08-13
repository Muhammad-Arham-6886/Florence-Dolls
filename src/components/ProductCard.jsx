import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { formatPrice, isOnSale, stockLabel } from '../lib/woo';
import './product-card.css';

export default function ProductCard({ product, layout = 'grid' }) {
  const image = product.images && product.images.length > 0 ? product.images[0] : null;
  const category = product.categories && product.categories.length > 0 ? product.categories[0] : null;
  const sale = isOnSale(product);
  const stock = stockLabel(product);
  const outOfStock = stock === 'Out of stock';
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);

  return (
    <article className={`product-card product-card--${layout}`}>
      <Link to={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__media">
          {sale && <span className="badge product-card__badge">Sale</span>}
          <button
            type="button"
            className={`product-card__heart ${wished ? 'product-card__heart--on' : ''}`}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M12 20.7 4.6 13.3a4.5 4.5 0 0 1 0-6.4 4.5 4.5 0 0 1 6.4 0l1 1 1-1a4.5 4.5 0 0 1 6.4 6.4L12 20.7Zm0-2.1 5.7-5.7a2.5 2.5 0 0 0-3.5-3.5L12 11.6l-2.2-2.2a2.5 2.5 0 0 0-3.5 3.5L12 18.6Z"
                fill={wished ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          {image ? (
            <img src={image.src} alt={image.alt || product.name} loading="lazy" />
          ) : (
            <div className="product-card__placeholder">{product.name}</div>
          )}
          <span className="product-card__view">View piece</span>
        </div>
        <div className="product-card__body">
          {category && <span className="product-card__category">{category.name}</span>}
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__price">
            {sale && product.prices?.regular_price && product.prices.sale_price !== product.prices.regular_price && (
              <span className="product-card__price-old">{formatPrice({ ...product.prices, price: product.prices.regular_price })}</span>
            )}
            <span className="product-card__price-current">{formatPrice(product.prices)}</span>
          </div>
          <span className={`product-card__stock ${outOfStock ? 'product-card__stock--out' : ''}`}>{stock}</span>
        </div>
      </Link>
      <div className="product-card__foot">
        <button
          type="button"
          className="btn btn-primary btn--sm product-card__cart"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
        >
          {outOfStock ? 'Unavailable' : 'Add to basket'}
        </button>
      </div>
    </article>
  );
}
