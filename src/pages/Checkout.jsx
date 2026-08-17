import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import {
  decodeHtml,
  fetchCheckoutCart,
  syncLocalCartToWp,
  updateCheckoutCustomer,
  selectCheckoutShippingRate,
  placeCheckoutOrder,
  fetchPaymentMethods,
  getShippingPackages,
  getCartToken,
  formatCartMoney,
  formatPrice,
} from '../lib/woo';
import './checkout.css';

const EMPTY_ADDRESS = {
  first_name: '',
  last_name: '',
  company: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'GB',
};

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

function slugFromPermalink(permalink) {
  if (!permalink) return '';
  const parts = String(permalink).replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || '';
}

export default function Checkout() {
  const { clearCart, cart: shopCart } = useShop();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [token, setToken] = useState(() => getCartToken());

  const [contact, setContact] = useState({ email: '', phone: '' });
  const [shipping, setShipping] = useState({ ...EMPTY_ADDRESS });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billing, setBilling] = useState({ ...EMPTY_ADDRESS });

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedRate, setSelectedRate] = useState('');
  const [ratesState, setRatesState] = useState('idle');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [syncedKey, setSyncedKey] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      try {
        const token = getCartToken();
        // Checkout must operate on the basket the customer actually sees. If the
        // local basket has items, make the WordPress cart match it first (the
        // two can drift apart when a session expires or a sync fails); otherwise
        // just read whatever WordPress has.
        const { cart: nextCart, token: nextToken } =
          shopCart && shopCart.length
            ? await syncLocalCartToWp(shopCart, token)
            : await fetchCheckoutCart(token);
        if (cancelled) return;
        setCart(nextCart);
        setToken(nextToken);
      } catch (err) {
        if (!cancelled) setCartError(err.message || 'Could not load your basket.');
      }
    };
    loadCart();
    fetchPaymentMethods().then((methods) => {
      if (cancelled) return;
      setPaymentMethods(methods);
      if (methods.length) setPaymentMethod(methods[0].id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = useCallback((group, setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  }, []);

  const contactKey = `${contact.email}|${contact.phone}`;

  const applyShippingOptions = useCallback(
    async (nextCart, tok) => {
      setCart(nextCart);
      const options = getShippingPackages(nextCart);
      setShippingOptions(options);
      if (options.length) {
        setRatesState('loaded');
        const next = options.find((r) => r.rate_id === selectedRate) || options[0];
        setSelectedRate(next.rate_id);
        try {
          const { cart: selected } = await selectCheckoutShippingRate(next.rate_id, tok);
          setCart(selected);
        } catch {
          /* totals simply stay without shipping */
        }
      } else {
        setRatesState('empty');
        setSelectedRate('');
      }
    },
    [selectedRate]
  );

  const getDeliveryOptions = useCallback(async () => {
    if (!token) {
      setRatesState('error');
      setNotice('We could not connect to our store. Please try again.');
      return;
    }
    setFormError(null);
    setNotice(null);
    setRatesState('loading');
    try {
      const billingAddress = sameAsBilling
        ? { ...shipping, email: contact.email, phone: contact.phone }
        : { ...billing, email: contact.email, phone: contact.phone };
      const { cart: nextCart } = await updateCheckoutCustomer(
        billingAddress,
        { ...shipping, email: contact.email, phone: contact.phone },
        token
      );
      setSyncedKey(JSON.stringify({ shipping, contactKey, sameAsBilling }));
      await applyShippingOptions(nextCart, token);
    } catch (err) {
      setRatesState('error');
      setNotice(err.message || 'We could not calculate delivery for that address.');
    }
  }, [token, shipping, billing, contact, contactKey, sameAsBilling, applyShippingOptions]);

  const ratesDirty = useMemo(
    () =>
      ratesState === 'loaded' &&
      syncedKey !== JSON.stringify({ shipping, contactKey, sameAsBilling }),
    [ratesState, syncedKey, shipping, contactKey, sameAsBilling]
  );

  const handleSelectRate = useCallback(
    async (rateId) => {
      setSelectedRate(rateId);
      if (!token) return;
      try {
        const { cart: nextCart } = await selectCheckoutShippingRate(rateId, token);
        setCart(nextCart);
      } catch (err) {
        setNotice(err.message || 'Could not select that delivery option.');
      }
    },
    [token]
  );

  const toggleSameBilling = useCallback(
    (checked) => {
      setSameAsBilling(checked);
      setBilling((prev) => ({ ...(checked ? shipping : shipping), ...prev }));
    },
    [shipping]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError(null);
      setNotice(null);
      if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        setFormError('Your basket is empty.');
        return;
      }
      if (cart.needs_shipping && !selectedRate) {
        setFormError('Please choose a delivery option for your order.');
        return;
      }
      if (!paymentMethod) {
        setFormError('Please choose a payment method.');
        return;
      }
      const shippingAddress = {
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        company: shipping.company,
        address_1: shipping.address_1,
        address_2: shipping.address_2,
        city: shipping.city,
        state: shipping.state,
        postcode: shipping.postcode,
        country: shipping.country,
        phone: contact.phone,
      };
      const billingAddress = sameAsBilling
        ? { ...shippingAddress, email: contact.email }
        : {
            first_name: billing.first_name,
            last_name: billing.last_name,
            company: billing.company,
            address_1: billing.address_1,
            address_2: billing.address_2,
            city: billing.city,
            state: billing.state,
            postcode: billing.postcode,
            country: billing.country,
            phone: billing.phone,
            email: contact.email,
          };
      setPlacing(true);
      try {
        const order = await placeCheckoutOrder({
          billingAddress,
          shippingAddress,
          paymentMethod,
          token,
        });
        const result = order && order.payment_result;
        const snapshotItems = [...(cart && cart.items) || []];
        const snapshotTotals = cart && cart.totals ? { ...cart.totals } : null;
        const snapshotShippingRate = shippingOptions.find((r) => r.rate_id === selectedRate) || null;
        const snapshotPaymentLabel = (paymentMethods.find((m) => m.id === paymentMethod) || {}).title || paymentMethod;
        const snapshotContact = { ...contact };
        clearCart();
        if (result && result.redirect_url) {
          window.location.assign(result.redirect_url);
          return;
        }
        if (result && result.payment_status === 'success') {
          navigate('/order-received', {
            replace: true,
            state: {
              order,
              items: snapshotItems,
              totals: snapshotTotals,
              shippingRate: snapshotShippingRate,
              paymentMethod: snapshotPaymentLabel,
              contact: snapshotContact,
            },
          });
          return;
        }
        setFormError(
          (result && result.payment_status) || 'We could not complete your order. Please try again.'
        );
      } catch (err) {
        const details = err.details;
        if (details && typeof details === 'object') {
          const first = Object.values(details)[0];
          setFormError(first && first.message ? first.message : err.message);
        } else {
          setFormError(err.message || 'We could not complete your order. Please try again.');
        }
      } finally {
        setPlacing(false);
      }
    },
    [cart, selectedRate, paymentMethod, token, shipping, billing, sameAsBilling, contact, clearCart, navigate, shippingOptions, paymentMethods]
  );

  const totals = (cart && cart.totals) || null;
  const items = (cart && cart.items) || [];

  if (cartError) {
    return (
      <div className="page container checkout-page">
        <SEO
          path="/checkout"
          title="Checkout"
          description="Complete your Florence Dolls order securely at checkout."
        />
        <p className="page__eyebrow">Checkout</p>
        <h1 className="page__title">Checkout unavailable</h1>
        <div className="notice">
          <p>{cartError}</p>
        </div>
        <Link to="/cart" className="btn btn-primary">Back to your basket</Link>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="page container checkout-page">
        <SEO
          path="/checkout"
          title="Checkout"
          description="Complete your Florence Dolls order securely at checkout."
        />
        <p className="status-note">Loading your basket&hellip;</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="page container checkout-page">
        <SEO
          path="/checkout"
          title="Checkout"
          description="Complete your Florence Dolls order securely at checkout."
        />
        <p className="page__eyebrow">Checkout</p>
        <h1 className="page__title">Your basket is empty</h1>
        <div className="notice">
          <p>Add some pieces to your basket before checking out.</p>
        </div>
        <Link to="/shop/reborn-dolls" className="btn btn-primary">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="page container checkout-page">
      <SEO
        path="/checkout"
        title="Checkout"
        description="Complete your Florence Dolls order securely at checkout."
      />

      <p className="page__eyebrow">Checkout</p>
      <h1 className="page__title">Almost yours</h1>
      <p className="page__lead">
        Enter your delivery and payment details. Delivery and payment options are calculated by our
        store as you go.
      </p>

      <form className="checkout" onSubmit={handleSubmit} noValidate>
        <div className="checkout__main">
          {formError && <p className="checkout__error" role="alert">{formError}</p>}
          {notice && <p className="checkout__notice" role="status">{notice}</p>}

          <section className="checkout-card" aria-labelledby="checkout-contact-title">
            <h2 className="checkout-card__title" id="checkout-contact-title">
              <span className="checkout-card__step">1</span> Your details
            </h2>
            <div className="checkout-fields">
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Email address</span>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={setField(contact, setContact)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={contact.phone}
                  onChange={setField(contact, setContact)}
                  placeholder="01274 400100"
                  autoComplete="tel"
                />
              </label>
            </div>
          </section>

          <section className="checkout-card" aria-labelledby="checkout-ship-title">
            <h2 className="checkout-card__title" id="checkout-ship-title">
              <span className="checkout-card__step">2</span> Delivery address
            </h2>
            <div className="checkout-fields">
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">First name</span>
                <input
                  type="text"
                  name="first_name"
                  value={shipping.first_name}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping given-name"
                  required
                />
              </label>
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Last name</span>
                <input
                  type="text"
                  name="last_name"
                  value={shipping.last_name}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping family-name"
                  required
                />
              </label>
              <label className="checkout-field">
                <span className="checkout-field__label">Company (optional)</span>
                <input
                  type="text"
                  name="company"
                  value={shipping.company}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping organization"
                />
              </label>
              <label className="checkout-field">
                <span className="checkout-field__label">Street address</span>
                <input
                  type="text"
                  name="address_1"
                  value={shipping.address_1}
                  onChange={setField(shipping, setShipping)}
                  placeholder="House number and street"
                  autoComplete="shipping address-line1"
                  required
                />
              </label>
              <label className="checkout-field">
                <span className="checkout-field__label">Apartment, suite, etc. (optional)</span>
                <input
                  type="text"
                  name="address_2"
                  value={shipping.address_2}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping address-line2"
                />
              </label>
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Town / City</span>
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping address-level2"
                  required
                />
              </label>
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Postcode</span>
                <input
                  type="text"
                  name="postcode"
                  value={shipping.postcode}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping postal-code"
                  required
                />
              </label>
              <label className="checkout-field checkout-field--half">
                <span className="checkout-field__label">Country</span>
                <select
                  name="country"
                  value={shipping.country}
                  onChange={setField(shipping, setShipping)}
                  autoComplete="shipping country"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </label>
              {(shipping.country === 'US' || shipping.country === 'CA' || shipping.country === 'AU') && (
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">State / Province</span>
                  <input
                    type="text"
                    name="state"
                    value={shipping.state}
                    onChange={setField(shipping, setShipping)}
                    autoComplete="shipping address-level1"
                  />
                </label>
              )}
            </div>

            <label className="checkout-toggle">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => toggleSameBilling(e.target.checked)}
              />
              <span>Billing address is the same as delivery</span>
            </label>

            {!sameAsBilling && (
              <div className="checkout-fields checkout-fields--billing">
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">Billing first name</span>
                  <input
                    type="text"
                    name="first_name"
                    value={billing.first_name}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing given-name"
                    required
                  />
                </label>
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">Billing last name</span>
                  <input
                    type="text"
                    name="last_name"
                    value={billing.last_name}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing family-name"
                    required
                  />
                </label>
                <label className="checkout-field">
                  <span className="checkout-field__label">Billing company (optional)</span>
                  <input
                    type="text"
                    name="company"
                    value={billing.company}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing organization"
                  />
                </label>
                <label className="checkout-field">
                  <span className="checkout-field__label">Billing street address</span>
                  <input
                    type="text"
                    name="address_1"
                    value={billing.address_1}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing address-line1"
                    required
                  />
                </label>
                <label className="checkout-field">
                  <span className="checkout-field__label">Billing apartment, suite, etc. (optional)</span>
                  <input
                    type="text"
                    name="address_2"
                    value={billing.address_2}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing address-line2"
                  />
                </label>
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">Billing town / city</span>
                  <input
                    type="text"
                    name="city"
                    value={billing.city}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing address-level2"
                    required
                  />
                </label>
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">Billing postcode</span>
                  <input
                    type="text"
                    name="postcode"
                    value={billing.postcode}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing postal-code"
                    required
                  />
                </label>
                <label className="checkout-field checkout-field--half">
                  <span className="checkout-field__label">Billing country</span>
                  <select
                    name="country"
                    value={billing.country}
                    onChange={setField(billing, setBilling)}
                    autoComplete="billing country"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </section>

          <section className="checkout-card" aria-labelledby="checkout-delivery-title">
            <h2 className="checkout-card__title" id="checkout-delivery-title">
              <span className="checkout-card__step">3</span> Delivery method
            </h2>
            {ratesState === 'idle' && (
              <>
                <p className="checkout-card__hint">
                  Tell us where you are sending the order to see the delivery options for that
                  address.
                </p>
                <button
                  type="button"
                  className="btn btn-ghost btn--sm"
                  onClick={getDeliveryOptions}
                  disabled={!shipping.country || !shipping.postcode || !shipping.city}
                >
                  Get delivery options
                </button>
              </>
            )}

            {ratesState === 'loading' && (
              <p className="status-note">Calculating delivery&hellip;</p>
            )}

            {ratesState === 'error' && (
              <p className="checkout__error">{notice || 'Could not calculate delivery.'}</p>
            )}

            {ratesState === 'empty' && (
              <p className="checkout-card__hint">
                Delivery options are not available for this address just yet. Please{' '}
                <Link to="/contact">contact us</Link> to arrange your order, or try another address.
              </p>
            )}

            {ratesState === 'loaded' && shippingOptions.length > 0 && (
              <>
                <div className="checkout-options">
                  {shippingOptions.map((rate) => (
                    <label className="checkout-option" key={rate.rate_id}>
                      <input
                        type="radio"
                        name="shipping-rate"
                        value={rate.rate_id}
                        checked={selectedRate === rate.rate_id}
                        onChange={() => handleSelectRate(rate.rate_id)}
                      />
                      <span className="checkout-option__body">
                        <span className="checkout-option__name">{decodeHtml(rate.name) || 'Delivery'}</span>
                        {rate.delivery_time && (
                          <span className="checkout-option__meta">{decodeHtml(rate.delivery_time)}</span>
                        )}
                      </span>
                      <span className="checkout-option__price">
                        {formatCartMoney(rate.price, totals)}
                      </span>
                    </label>
                  ))}
                </div>
                {ratesDirty && (
                  <button type="button" className="btn btn-ghost btn--sm checkout__recalc" onClick={getDeliveryOptions}>
                    Recalculate for this address
                  </button>
                )}
              </>
            )}

            {ratesState === 'idle' && !shipping.country && (
              <p className="checkout-card__hint">Complete the delivery address above first.</p>
            )}
          </section>

          <section className="checkout-card" aria-labelledby="checkout-payment-title">
            <h2 className="checkout-card__title" id="checkout-payment-title">
              <span className="checkout-card__step">4</span> Payment method
            </h2>
            <p className="checkout-card__hint">
              Payment options are provided by our store and will be confirmed on your receipt.
            </p>
            <div className="checkout-options">
              {paymentMethods.map((method) => (
                <label className="checkout-option" key={method.id}>
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="checkout-option__body">
                    <span className="checkout-option__name">{method.title}</span>
                    {method.description && (
                      <span
                        className="checkout-option__meta"
                        dangerouslySetInnerHTML={{ __html: method.description }}
                      />
                    )}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="checkout__actions">
            <button type="submit" className="btn btn-primary checkout__submit" disabled={placing}>
              {placing ? 'Placing your order…' : 'Place your order'}
            </button>
            <Link to="/cart" className="arrow-link">Back to basket</Link>
          </div>
        </div>

        <aside className="checkout-summary" aria-label="Order summary">
          <h2 className="checkout-summary__title">Your order</h2>
          <ul className="checkout-summary__items">
            {items.map((item) => (
              <li className="checkout-summary__item" key={item.key}>
                <span className="checkout-summary__thumb">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0].src} alt={decodeHtml(item.name)} />
                  ) : (
                    <span>{decodeHtml(item.name)}</span>
                  )}
                </span>
                <span className="checkout-summary__meta">
                  <Link
                    to={`/product/${slugFromPermalink(item.permalink)}`}
                    className="checkout-summary__name"
                  >
                    {decodeHtml(item.name)}
                  </Link>
                  <span className="checkout-summary__qty">Qty {item.quantity}</span>
                </span>
                <span className="checkout-summary__price">{formatPrice(item.prices)}</span>
              </li>
            ))}
          </ul>
          <dl className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <dt>Subtotal</dt>
              <dd>{totals ? formatCartMoney(totals.total_items, totals) : '\u2014'}</dd>
            </div>
            <div className="checkout-summary__row">
              <dt>Delivery</dt>
              <dd>
                {selectedRate && totals ? formatCartMoney(totals.total_shipping, totals) : 'To be confirmed'}
              </dd>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <dt>Total</dt>
              <dd>{totals ? formatCartMoney(totals.total_price, totals) : '\u2014'}</dd>
            </div>
          </dl>
          <p className="checkout-summary__note">
            Your order is completed securely through our store. Payment and delivery are confirmed
            on your receipt.
          </p>
        </aside>
      </form>
    </div>
  );
}
