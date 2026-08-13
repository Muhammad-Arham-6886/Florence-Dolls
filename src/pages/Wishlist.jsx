import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import { useShop } from '../context/ShopContext';
import './wishlist.css';
import './shop.css';

export default function Wishlist() {
  const { wishlist } = useShop();

  return (
    <div className="page container">
      <SEO
        path="/wishlist"
        title="Your Wishlist"
        description="The pieces you have saved at Florence Dolls, gathered in one place."
      />

      <p className="page__eyebrow">Saved pieces</p>
      <h1 className="page__title">Your wishlist</h1>
      <p className="page__lead">
        Pieces you have fallen for, kept close. They will wait here while you decide.
      </p>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="46" height="46"><path d="M12 20.7 4.6 13.3a4.5 4.5 0 0 1 0-6.4 4.5 4.5 0 0 1 6.4 0l1 1 1-1a4.5 4.5 0 0 1 6.4 6.4L12 20.7Zm0-2.1 5.7-5.7a2.5 2.5 0 0 0-3.5-3.5L12 11.6l-2.2-2.2a2.5 2.5 0 0 0-3.5 3.5L12 18.6Z" fill="currentColor" /></svg>
          </span>
          <p>Nothing is saved yet. Tap the heart on any piece to keep it here.</p>
          <Link to="/new-arrivals" className="btn btn-primary">Discover new arrivals</Link>
        </div>
      ) : (
        <>
          <div className="wishlist__count">
            <span className="shop__count-line" aria-hidden="true" />
            <span className="shop__count-text">
              {wishlist.length} saved piece{wishlist.length === 1 ? '' : 's'}
            </span>
          </div>
          <ProductGrid
            products={wishlist.map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              images: item.image ? [{ id: item.id, src: item.image, alt: item.name }] : [],
              prices: item.prices,
              categories: item.categories || [],
            }))}
          />
        </>
      )}
    </div>
  );
}