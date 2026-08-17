import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import { decodeHtml, formatPrice, formatCartMoney } from '../lib/woo';
import './order-received.css';

export default function OrderReceived() {
  const { state } = useLocation();
  const { cart: shopCart } = useShop();

  if (!state || !state.order) {
    return (
      <div className="page container order-received-page">
        <SEO
          path="/order-received"
          title="Order Received"
          description="Your Florence Dolls order has been received."
        />
        <p className="page__eyebrow">Order</p>
        <h1 className="page__title">No order details found</h1>
        <div className="order-received__empty">
          <p>We could not find your order information. This may happen if you refreshed the page or navigated here directly.</p>
          <Link to="/" className="order-received__btn">Return to shop</Link>
        </div>
      </div>
    );
  }

  const { order, items, totals, shippingRate, paymentMethod, contact } = state;

  return (
    <div className="page container order-received-page">
      <SEO
        path="/order-received"
        title="Order Received"
        description="Your Florence Dolls order has been received."
      />
      <p className="page__eyebrow">Order Received</p>
      <h1 className="page__title">Thank you for your order!</h1>

      <div className="order-received">
        <div className="order-received__success">
          <p>Your order has been placed successfully. We will be in touch to arrange payment and delivery.</p>
        </div>

        <div className="order-received__card">
          <h2 className="order-received__card-title">Order Details</h2>
          <dl className="order-received__info">
            <div className="order-received__info-row">
              <dt>Order number</dt>
              <dd>{order.order_number || order.order_id}</dd>
            </div>
            <div className="order-received__info-row">
              <dt>Date</dt>
              <dd>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            </div>
            <div className="order-received__info-row">
              <dt>Payment method</dt>
              <dd>{paymentMethod || '—'}</dd>
            </div>
            {contact && contact.email && (
              <div className="order-received__info-row">
                <dt>Email</dt>
                <dd>{contact.email}</dd>
              </div>
            )}
          </dl>
        </div>

        {items && items.length > 0 && (
          <div className="order-received__card">
            <h2 className="order-received__card-title">Order Items</h2>
            <ul className="order-received__items">
              {items.map((item) => (
                <li className="order-received__item" key={item.key}>
                  <span className="order-received__item-thumb">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0].src} alt={decodeHtml(item.name)} />
                    ) : (
                      <span>{decodeHtml(item.name)}</span>
                    )}
                  </span>
                  <span className="order-received__item-meta">
                    <span className="order-received__item-name">{decodeHtml(item.name)}</span>
                    <span className="order-received__item-qty">Qty {item.quantity}</span>
                  </span>
                  <span className="order-received__item-price">{formatPrice(item.prices)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {totals && (
          <div className="order-received__card">
            <h2 className="order-received__card-title">Order Summary</h2>
            <dl className="order-received__totals">
              <div className="order-received__totals-row">
                <dt>Subtotal</dt>
                <dd>{formatCartMoney(totals.total_items, totals)}</dd>
              </div>
              <div className="order-received__totals-row">
                <dt>Shipping</dt>
                <dd>
                  {shippingRate
                    ? `${shippingRate.name || 'Shipping'} — ${formatCartMoney(totals.total_shipping, totals)}`
                    : formatCartMoney(totals.total_shipping, totals)}
                </dd>
              </div>
              <div className="order-received__totals-row order-received__totals-row--total">
                <dt>Total</dt>
                <dd>{formatCartMoney(totals.total_price, totals)}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="order-received__actions">
          <Link to="/shop/all" className="order-received__btn">Continue shopping</Link>
          <Link to="/" className="order-received__btn order-received__btn--secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
