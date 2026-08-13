import { Link, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import './auth.css';

export default function Account() {
  const { user, logout, cartCount, wishlist } = useShop();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page container">
      <SEO
        path="/account"
        title="Your Account"
        description="Your Florence Dolls account \u2014 saved pieces, basket and details."
      />

      <p className="page__eyebrow">Your account</p>
      <h1 className="page__title">Hello, {user.name.split(' ')[0]}</h1>

      <div className="account-grid">
        <div className="account-card">
          <h3 className="account-card__title">Saved pieces</h3>
          <p className="account-card__value">{wishlist.length}</p>
          <p className="account-card__note">on your wishlist</p>
          <Link to="/wishlist" className="btn btn-ghost btn--sm">View wishlist</Link>
        </div>
        <div className="account-card">
          <h3 className="account-card__title">Basket</h3>
          <p className="account-card__value">{cartCount}</p>
          <p className="account-card__note">item{cartCount === 1 ? '' : 's'} held for you</p>
          <Link to="/cart" className="btn btn-ghost btn--sm">View basket</Link>
        </div>
        <div className="account-card">
          <h3 className="account-card__title">Details</h3>
          <p className="account-card__email">{user.email}</p>
          <p className="account-card__note">Your name and email are kept on this device.</p>
          <button type="button" className="btn btn-ghost btn--sm" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}