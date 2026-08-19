import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SITE, CATEGORY_SLUGS } from '../config';
import { useShop } from '../context/ShopContext';
import { formatPrice, formatTotal } from '../lib/woo';
import './site.css';

const shopLinks = [
  { label: 'Reborn Dolls', to: `/shop/${CATEGORY_SLUGS.rebornDolls}` },
  { label: 'Prams & Pushchairs', to: `/shop/${CATEGORY_SLUGS.prams}` },
  { label: 'Doll Furniture', to: `/shop/${CATEGORY_SLUGS.furniture}` },
  { label: 'Doll Accessories', to: `/shop/${CATEGORY_SLUGS.accessories}` },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Sale', to: '/sale' },
];

const brandLinks = [
  { label: 'Arias', to: '/brand/arias' },
  { label: 'Llorens', to: '/brand/llorens' },
];

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isActive = items.some((i) => {
    const path = window.location.pathname;
    return path === i.to || path.startsWith(`${i.to}/`);
  });

  return (
    <div className="nav-dd" ref={ref}>
      <button
        type="button"
        className={`nav-dd__btn ${open || isActive ? 'nav-dd__btn--active' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className="nav-dd__caret" aria-hidden="true" />
      </button>
      <div className={`nav-dd__panel ${open ? 'nav-dd__panel--open' : ''}`}>
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} className="nav-dd__item" onClick={() => setOpen(false)}>
            {i.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function CartBadge() {
  const { cart, cartCount, removeFromCart } = useShop();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const unitPrice = (item) => Number(item.prices?.price || item.prices?.regular_price || 0) / 100;

  return (
    <div className="hdr-cart" ref={ref}>
      <button
        type="button"
        className="hdr-icon"
        aria-label={`Basket, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
          <path d="M6 7h12l1.2 13H4.8L6 7Zm2.2 1-.9 11h9.4l-.9-11H8.2ZM10 3.5a2 2 0 0 1 4 0V7h1.5V3.5a3.5 3.5 0 0 0-7 0V7H10V3.5Z" fill="currentColor" />
        </svg>
        {cartCount > 0 && <span className="hdr-icon__badge">{cartCount}</span>}
      </button>
      <div className={`hdr-cart__panel ${open ? 'hdr-cart__panel--open' : ''}`}>
        {cart.length === 0 ? (
          <p className="hdr-cart__empty">Your basket is empty.</p>
        ) : (
          <>
            <ul className="hdr-cart__list">
              {cart.slice(0, 4).map((item) => (
                <li className="hdr-cart__item" key={item.id}>
                  <Link to={`/product/${item.slug}`} className="hdr-cart__item-link" onClick={() => setOpen(false)}>
                    {item.image ? (
                      <img className="hdr-cart__thumb" src={item.image} alt="" />
                    ) : (
                      <span className="hdr-cart__thumb hdr-cart__thumb--ph">{item.name}</span>
                    )}
                    <span className="hdr-cart__item-info">
                      <span className="hdr-cart__item-name">{item.name}</span>
                      <span className="hdr-cart__item-meta">
                        {item.qty} &times; {formatPrice(item.prices)}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="hdr-cart__remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            <div className="hdr-cart__foot">
              <span className="hdr-cart__total-label">Subtotal</span>
              <span className="hdr-cart__total">{formatTotal(cart.reduce((s, i) => s + i.qty * unitPrice(i), 0), cart[0]?.prices)}</span>
            </div>
            <Link to="/cart" className="btn btn-primary btn--sm hdr-cart__btn" onClick={() => setOpen(false)}>
              View basket
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user, cartCount } = useShop();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="announce">
        <div className="container announce__inner">
          <p className="announce__text">All stock held in the UK &middot; Fast {SITE.deliveryWindow} &middot; Genuine Arias &amp; Llorens &middot; Save an extra 5% with code: WELCOME5</p>
          <div className="announce__links">
            <a className="announce__link" href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a>
            <span className="announce__dot" aria-hidden="true" />
            <a className="announce__link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
      </div>

      <div className="site-header__main">
        <div className="container site-header__inner">
          <Link to="/" className="site-header__brand" aria-label="Florence Dolls home">
            <span className="site-header__brand-name">
              Florence<span className="site-header__brand-accent">Dolls</span>
            </span>
            <span className="site-header__brand-sub">Reborn Dolls &middot; Genuine &amp; Loved</span>
          </Link>

          <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => `site-nav__link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `site-nav__link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
            <Dropdown label="Shop" items={shopLinks} />
            <Dropdown label="Brands" items={brandLinks} />
            <NavLink to="/blog" className={({ isActive }) => `site-nav__link ${isActive ? 'active' : ''}`}>
              Journal
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `site-nav__link site-nav__cta ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
            <div className="site-nav__tools-mobile">
              <button
                type="button"
                className="hdr-icon"
                aria-label="Search the shop"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setMenuOpen(false);
                }}
              >
                <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                  <path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm5.2 8.6 1.4-1.4 3 3-1.4 1.4-3-3Z" fill="currentColor" />
                </svg>
              </button>
              <Link to="/wishlist" className="hdr-icon" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                  <path d="M12 20.7 4.6 13.3a4.5 4.5 0 0 1 0-6.4 4.5 4.5 0 0 1 6.4 0l1 1 1-1a4.5 4.5 0 0 1 6.4 6.4L12 20.7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
              <Link to={user ? '/account' : '/login'} className="hdr-icon" aria-label={user ? 'Account' : 'Sign in'}>
                <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c4.4 0 8 2 8 4.5V21H4v-2.5c0-2.5 3.6-4.5 8-4.5Z" fill="currentColor" />
                </svg>
              </Link>
              <CartBadge />
            </div>
          </nav>

          <div className="site-header__tools">
            <button
              type="button"
              className="hdr-icon"
              aria-label="Search the shop"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                <path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm5.2 8.6 1.4-1.4 3 3-1.4 1.4-3-3Z" fill="currentColor" />
              </svg>
            </button>
            <Link to="/wishlist" className="hdr-icon" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                <path d="M12 20.7 4.6 13.3a4.5 4.5 0 0 1 0-6.4 4.5 4.5 0 0 1 6.4 0l1 1 1-1a4.5 4.5 0 0 1 6.4 6.4L12 20.7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
            <Link to={user ? '/account' : '/login'} className="hdr-icon" aria-label={user ? 'Account' : 'Sign in'}>
              <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c4.4 0 8 2 8 4.5V21H4v-2.5c0-2.5 3.6-4.5 8-4.5Z" fill="currentColor" />
              </svg>
            </Link>
            <CartBadge />
          </div>

          <button
            className="site-header__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {searchOpen && (
          <div className="site-header__search">
            <div className="container">
              <form className="site-header__search-form" onSubmit={submitSearch} role="search">
                <svg className="site-header__search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm5.2 8.6 1.4-1.4 3 3-1.4 1.4-3-3Z" fill="currentColor" />
                </svg>
                <input
                  type="search"
                  placeholder="Search reborn dolls, prams, furniture..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  aria-label="Search the shop"
                />
                <button type="submit" className="btn btn-primary btn--sm">Search</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}