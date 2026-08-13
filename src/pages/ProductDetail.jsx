import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SITE } from '../config';
import { useShop } from '../context/ShopContext';
import {
  fetchProductDetail,
  fetchProductReviews,
  submitProductReview,
  buildAttributes,
  formatPrice,
  isOnSale,
  stockLabel,
} from '../lib/woo';
import './product-detail.css';

function cleanText(html) {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el.textContent || '';
}

const returnPolicy = `
<p><strong>Retail Returns &ndash; 14-Day Return Period</strong></p>
<p><strong>Eligibility</strong></p>
<p>Retail customers may request a return within <strong>14 days of receiving their order</strong>.</p>
<p>To qualify for a refund, returned items must:</p>
<ul>
<li>Be completely unused and unopened.</li>
<li>Remain in their original manufacturer packaging.</li>
<li>Have all security tags, seals, labels, and accessories intact.</li>
<li>Be returned in a resalable condition.</li>
<li>Include proof of purchase.</li>
</ul>
<p>Customers must provide their name, delivery address, contact details, order number, and a brief reason for the return.</p>
<p><strong>Return Shipping</strong></p>
<p>All approved returns must be sent using a <strong>tracked and reliable courier service</strong>. Return postage costs are the responsibility of the customer unless the item was supplied incorrectly or has a confirmed manufacturing defect.</p>
<p>Original outbound delivery charges are <strong>non-refundable</strong>.</p>
<p><strong>Faulty or Damaged Items &ndash; 48-Hour Notification</strong></p>
<p>If your order arrives with a manufacturing fault or has been damaged during delivery, please contact us within <strong>48 hours</strong> of receiving your parcel.</p>
<p>To help us investigate the issue quickly, please provide:</p>
<ul>
<li>Your order number.</li>
<li>A clear description of the fault or damage.</li>
<li>Clear photographs of the affected product.</li>
<li>Photographs showing the external packaging and shipping box.</li>
</ul>
<p>Please do not dispose of the original packaging until the issue has been reviewed, as it may be required for our investigation or courier claim.</p>
<p><strong>Wholesale &amp; Trade Orders &ndash; Final Sale</strong></p>
<p>Wholesale and trade purchases made through approved business accounts are considered <strong>final sale</strong>.</p>
<p>As wholesale products are supplied to businesses for commercial resale, trade customers are responsible for handling returns, exchanges, and refunds requested by their own retail customers.</p>
<p><strong>Order Changes &amp; Cancellations</strong></p>
<p>Once a wholesale order has been confirmed and processed, it cannot normally be cancelled, modified, or refunded. Customers should carefully check product quantities, item codes, delivery details, and billing information before completing their order.</p>
<p><strong>Wholesale Delivery Issues</strong></p>
<p>Any shortages, incorrect items, or transit damage relating to a wholesale shipment must be reported within <strong>48 hours</strong> of delivery.</p>
<p>Photographic evidence may be required, and affected products should remain unused and in their original packaging while the matter is being reviewed.</p>
<p>Depending on the circumstances, Florence Dolls may offer a replacement, credit, or another appropriate resolution following our internal assessment.</p>
<p><strong>Refund Processing</strong></p>
<p>Once an approved return has been received and inspected, we will confirm whether the item meets the applicable return requirements. Approved refunds will be processed using the <strong>original payment method</strong>.</p>
<p>Please allow reasonable processing time for the refund to appear in your account, depending on your payment provider.</p>
<p>If you have any questions regarding returns, refunds, faulty items, or wholesale orders, please contact the Florence Dolls customer support team before sending an item back.</p>
`;

const faqs = `
<p><strong>Q: How do I start a return?</strong></p>
<p>A: Contact the Florence Dolls customer support team before sending any item back. Provide your name, delivery address, contact details, order number, and a brief reason for the return.</p>
<p><strong>Q: How long do I have to return an item?</strong></p>
<p>A: Retail customers may request a return within 14 days of receiving their order. The item must be completely unused, unopened, and in original manufacturer packaging with all tags and accessories intact.</p>
<p><strong>Q: Who pays for return shipping?</strong></p>
<p>A: Return postage costs are the responsibility of the customer unless the item was supplied incorrectly or has a confirmed manufacturing defect.</p>
<p><strong>Q: What if my item is faulty or damaged?</strong></p>
<p>A: Contact us within 48 hours of receiving your parcel. Provide your order number, a clear description of the fault/damage, and clear photographs. Keep the original packaging until the issue is reviewed.</p>
<p><strong>Q: Are wholesale/final sale items returnable?</strong></p>
<p>A: Wholesale and trade purchases are final sale. Once confirmed and processed, orders cannot normally be cancelled, modified, or refunded. Customers should carefully check product quantities, item codes, delivery details, and billing information before completing their order.</p>
`;

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [reviewState, setReviewState] = useState({ status: 'idle', message: '' });
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchProductDetail(slug)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setLoading(false);
        if (p && p.id) {
          fetchProductReviews(p.id).then((r) => {
            if (!cancelled) setReviews(Array.isArray(r) ? r : []);
          });
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
  }, [slug]);

  if (loading)
    return (
      <div className="page container">
        <p className="status-note">Gently opening this piece&hellip;</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="page container">
        <p className="status-note">We could not find that piece. It may have found a home already.</p>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
          <Link to="/new-arrivals" className="btn btn-ghost">Browse new arrivals</Link>
        </div>
      </div>
    );

  const sale = isOnSale(product);
  const stock = stockLabel(product);
  const outOfStock = stock === 'Out of stock';
  const wished = isWishlisted(product.id);
  const images = product.images && product.images.length ? product.images : [];
  const shortDescription = product.short_description || '';
  const fullDescription = product.description || product.short_description || '';
  const attrs = buildAttributes(product);
  const category = product.categories && product.categories.length ? product.categories[0] : null;
  const tags = Array.isArray(product.tags)
    ? product.tags.map((t) => (typeof t === 'string' ? t : t.name || ''))
    : [];
  const name = product.name || '';
  const brand = /arias/i.test(name)
    ? 'Arias'
    : /llorens/i.test(name)
      ? 'Llorens'
      : tags.find((t) => /arias|llorens/i.test(t)) || '';
  const avgRating = Number(product.average_rating || 0);
  const reviewCount = Number(product.review_count || 0);

  function submitReview(e) {
    e.preventDefault();
    if (!product || reviewState.status === 'submitting') return;
    setReviewState({ status: 'submitting', message: '' });
    submitProductReview({
      productId: product.id,
      name: reviewForm.name,
      email: reviewForm.email,
      comment: reviewForm.comment,
      rating: reviewForm.rating,
    })
      .then((result) => {
        if (result.ok) {
          setReviewState({
            status: 'success',
            message:
              'Thank you for your review! It has been submitted and will appear here once approved.',
          });
          setReviewForm({ name: '', email: '', rating: 5, comment: '' });
        } else {
          setReviewState({
            status: 'error',
            message:
              'We could not submit your review. Please check your details and try again.',
          });
        }
      })
      .catch(() => {
        setReviewState({
          status: 'error',
          message: 'There was a problem submitting your review. Please try again in a moment.',
        });
      });
  }

  return (
    <div className="page container">
      <SEO
        path={`/product/${product.slug}`}
        title={product.name}
        description={
          fullDescription
            ? cleanText(fullDescription).slice(0, 155)
            : `Buy ${product.name} from Florence Dolls. Genuine UK stock, fast delivery.`
        }
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/shop/${category.slug}`}>{category.name}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="breadcrumbs__current">{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className="pdp-media">
          {sale && <span className="badge pdp__badge">Sale</span>}
          {images.length > 0 ? (
            <>
              <div className="pdp-media__main">
                <img src={images[activeImage].src} alt={images[activeImage].alt || product.name} />
              </div>
              {images.length > 1 && (
                <div className="pdp-media__thumbs">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      className={`pdp-media__thumb ${i === activeImage ? 'pdp-media__thumb--active' : ''}`}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img.src} alt={img.alt || ''} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="pdp-media__placeholder">{product.name}</div>
          )}
        </div>

        <div className="pdp-info">
          {category && <p className="page__eyebrow">{category.name}</p>}
          <h1 className="pdp__name">{product.name}</h1>

          <div className="pdp__price-row">
            {sale && product.prices?.regular_price && product.prices.sale_price !== product.prices.regular_price && (
              <span className="pdp__price-old">
                {formatPrice({ ...product.prices, price: product.prices.regular_price })}
              </span>
            )}
            <span className="pdp__price-current">{formatPrice(product.prices)}</span>
            {sale && <span className="pdp__save">Reduced</span>}
          </div>
          <p className={`pdp__stock ${outOfStock ? 'pdp__stock--out' : ''}`}>{stock}</p>

          {shortDescription && (
            <div className="pdp__description reading">
              <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
            </div>
          )}

          <div className="pdp__actions">
            <div className="pdp__qty">
              <button
                type="button"
                className="pdp__qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span className="pdp__qty-num">{qty}</span>
              <button
                type="button"
                className="pdp__qty-btn"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={outOfStock}
              onClick={() => addToCart(product, qty)}
            >
              {outOfStock ? 'Currently Unavailable' : 'Add to Basket'}
            </button>
            <button
              type="button"
              className={`btn btn-ghost pdp__wish ${wished ? 'pdp__wish--on' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              {wished ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>
            <Link to="/contact" className="btn btn-ghost">Ask a question</Link>
          </div>

          <div className="pdp__assurances">
            <div className="pdp__assurance">
              <span className="pdp__assurance-icon" aria-hidden="true">{'\u2713'}</span>
              <span>All stock held in the UK &middot; fast {SITE.deliveryWindow} delivery</span>
            </div>
            <div className="pdp__assurance">
              <span className="pdp__assurance-icon" aria-hidden="true">{'\u2713'}</span>
              <span>Secure online ordering with tracking</span>
            </div>
            <div className="pdp__assurance">
              <span className="pdp__assurance-icon" aria-hidden="true">{'\u2713'}</span>
              <span>14-day distance-selling returns</span>
            </div>
          </div>

          <p className="pdp__enquiry">
            A question about this piece? <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </div>

      <div className="pdp-tabs-wrap">
        <div className="pdp__tabs" role="tablist" aria-label="Product information">
          {[
            ['description', 'Description'],
            ['additional', 'Additional Info'],
            ['brand', 'Brand'],
            ['reviews', `Reviews${reviewCount ? ` (${reviewCount})` : ''}`],
            ['policy', 'Returns & Refund Policy'],
            ['faqs', 'FAQs'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={`pdp__tab ${activeTab === key ? 'pdp__tab--active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pdp__tab-content">
          {activeTab === 'description' && (
            <div className="pdp__panel">
              <h3 className="pdp__panel-title">{product.name}</h3>
              {fullDescription ? (
                <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
              ) : (
                <p className="pdp__no-content">No description available for this piece.</p>
              )}
              {attrs.length > 0 && (
                <div className="pdp__specs">
                  <h4 className="pdp__specs-title">Details</h4>
                  <dl className="pdp__spec-table">
                    {attrs.map((a) => (
                      <div className="pdp__spec-row" key={a.name}>
                        <dt>{a.name}</dt>
                        <dd>{a.values.join(', ')}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="pdp__panel">
              {attrs.length > 0 ? (
                <dl className="pdp__spec-table">
                  {attrs.map((a) => (
                    <div className="pdp__spec-row" key={a.name}>
                      <dt>{a.name}</dt>
                      <dd>{a.values.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="pdp__no-content">No additional information available.</p>
              )}
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="pdp__panel">
              {brand ? (
                <p>
                  <strong>Brand:</strong> <Link to={`/brand/${brand.toLowerCase()}`}>{brand}</Link>
                </p>
              ) : (
                <p className="pdp__no-content">Brand information not available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="pdp__panel">
              <p className="pdp__reviews-summary">
                {reviewCount > 0 ? (
                  <>
                    Rated <strong>{avgRating.toFixed(1)} / 5</strong> from {reviewCount} customer{' '}
                    {reviewCount === 1 ? 'review' : 'reviews'}
                  </>
                ) : (
                  'No reviews yet \u2014 be the first to review this piece.'
                )}
              </p>
              {reviews.length > 0 && (
                <ul className="pdp__reviews-list">
                  {reviews.map((rev, i) => (
                    <li key={rev.id || i} className="pdp__review">
                      <span className="pdp__review-rating">
                        {'\u2605'.repeat(Math.max(1, Math.min(5, Number(rev.rating) || 5)))}
                      </span>
                      <p className="pdp__review-text">
                        {cleanText(rev.review || rev.content || '')}
                      </p>
                      <span className="pdp__review-meta">
                        Verified buyer &middot; {rev.date_created ? new Date(rev.date_created).toLocaleDateString() : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pdp__review-form-wrap">
                <h4 className="pdp__review-form-title">Add a review</h4>
                {reviewState.status === 'success' && (
                  <p className="pdp__review-notice pdp__review-notice--ok" role="status">
                    {reviewState.message}
                  </p>
                )}
                {reviewState.status === 'error' && (
                  <p className="pdp__review-notice pdp__review-notice--err" role="alert">
                    {reviewState.message}
                  </p>
                )}
                <form className="pdp__review-form" onSubmit={submitReview}>
                  <div className="pdp__review-form-row">
                    <label className="pdp__review-field">
                      <span className="pdp__review-label">Your name</span>
                      <input
                        type="text"
                        name="author"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </label>
                    <label className="pdp__review-field">
                      <span className="pdp__review-label">Email address</span>
                      <input
                        type="email"
                        name="email"
                        required
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </label>
                  </div>
                  <div className="pdp__review-rating-field">
                    <span className="pdp__review-label">Your rating</span>
                    <div className="pdp__review-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} star${n === 1 ? '' : 's'}`}
                          className={`pdp__review-star${reviewForm.rating >= n ? ' is-on' : ''}`}
                          onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                        >
                          {'\u2605'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="pdp__review-field">
                    <span className="pdp__review-label">Your review</span>
                    <textarea
                      name="comment"
                      required
                      rows="4"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewState.status === 'submitting'}
                  >
                    {reviewState.status === 'submitting' ? 'Submitting\u2026' : 'Submit review'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="pdp__panel">
              <div dangerouslySetInnerHTML={{ __html: returnPolicy }} />
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="pdp__panel">
              <div dangerouslySetInnerHTML={{ __html: faqs }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}