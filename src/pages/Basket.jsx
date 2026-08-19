import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import { formatPrice, formatTotal, formatCartMoney } from '../lib/woo';
import './basket.css';

export default function Basket() {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal, applyCoupon, removeCoupon, appliedCoupons, wcCartTotals } = useShop();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  const unitPrice = (item) => Number(item.prices?.price || item.prices?.regular_price || 0) / 100;

  return (
    <div className="page container">
      <SEO
        path="/cart"
        title="Your Basket"
        description="Review the pieces in your Florence Dolls basket before checkout."
      />

      <p className="page__eyebrow">Your basket</p>
      <h1 className="page__title">The pieces you love</h1>

      {cart.length === 0 ? (
        <div className="basket-empty">
          <p className="basket-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="44" height="44"><path d="M6 7h12l1 13H5L6 7Zm2 1-.8 10h9.6L16 8H8Zm2-3a2 2 0 0 1 4 0h1.5a3.5 3.5 0 0 0-7 0H10Z" fill="currentColor" /></svg>
          </p>
          <p>Your basket is quietly empty for now.</p>
          <Link to="/new-arrivals" className="btn btn-primary">Browse new arrivals</Link>
        </div>
      ) : (
        <>
          <div className="basket-list">
            {cart.map((item) => (
              <div className="basket-item" key={item.id}>
                <Link to={`/product/${item.slug}`} className="basket-item__media">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span className="basket-item__ph">{item.name}</span>
                  )}
                </Link>
                <div className="basket-item__info">
                  <Link to={`/product/${item.slug}`} className="basket-item__name">
                    {item.name}
                  </Link>
                  <span className="basket-item__price">{formatPrice(item.prices)}</span>
                </div>
                <div className="basket-item__qty">
                  <button
                    className="basket-item__step"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className="basket-item__qty-num">{item.qty}</span>
                  <button
                    className="basket-item__step"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="basket-item__line">
                  {formatTotal(item.qty * unitPrice(item), item.prices)}
                </div>
                <button
                  className="basket-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="basket-summary">
            <div className="basket-summary__row">
              <span>Subtotal</span>
              <strong>
                {wcCartTotals
                  ? formatCartMoney(wcCartTotals.total_items, wcCartTotals)
                  : formatTotal(cartTotal, cart[0]?.prices)}
              </strong>
            </div>
            {wcCartTotals && Number(wcCartTotals.total_discount) > 0 && (
              <div className="basket-summary__row basket-summary__row--discount">
                <span>Discount</span>
                <strong>-{formatCartMoney(wcCartTotals.total_discount, wcCartTotals)}</strong>
              </div>
            )}
            <div className="basket-summary__row basket-summary__row--note">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <p className="basket-summary__hint">
              Ordering is completed on our secure store, where payment and delivery are arranged together.
            </p>

            {appliedCoupons && appliedCoupons.length > 0 && (
              <div className="basket-coupons">
                {appliedCoupons.map((c) => (
                  <span className="basket-coupons__tag" key={c.code}>
                    {c.code.toUpperCase()} — {c.total}
                    <button type="button" className="basket-coupons__remove" onClick={() => removeCoupon(c.code)} aria-label={`Remove coupon ${c.code}`}>&times;</button>
                  </span>
                ))}
              </div>
            )}

            <div className="basket-coupon">
              <input
                className="basket-coupon__input"
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponError(null); }}
                disabled={couponLoading}
              />
              <button
                className="basket-coupon__btn"
                type="button"
                disabled={couponLoading || !couponCode.trim()}
                onClick={async () => {
                  setCouponLoading(true);
                  setCouponError(null);
                  try {
                    await applyCoupon(couponCode.trim());
                    setCouponCode('');
                  } catch (err) {
                    setCouponError(err.message || 'Invalid coupon code.');
                  } finally {
                    setCouponLoading(false);
                  }
                }}
              >
                {couponLoading ? 'Applying…' : 'Apply'}
              </button>
            </div>
            {couponError && <p className="basket-coupon__error">{couponError}</p>}
            <div className="basket-summary__actions">
              <Link to="/checkout" className="btn btn-primary">Proceed to checkout</Link>
              <button type="button" className="btn btn-ghost" onClick={clearCart}>
                Empty basket
              </button>
            </div>
            <Link to="/shop/reborn-dolls" className="basket-summary__continue">
              &larr; Continue browsing the shop
            </Link>
          </div>
        </>
      )}
    </div>
  );
}