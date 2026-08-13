import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function ShippingDelivery() {
  return (
    <div className="page container">
      <SEO {...SEO_META.shipping} />
      <p className="page__eyebrow">Getting your piece home</p>
      <h1>Shipping &amp; Delivery</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          All Florence Dolls stock is held here in the UK, which is why we can promise a fast, honest delivery to British doorsteps &mdash; usually within 2&ndash;3 working days of your order being placed.
        </p>

        <h2>UK delivery</h2>
        <p>
          Orders are carefully packed and handed to our delivery partners promptly. Standard UK delivery typically arrives within {SITE.deliveryWindow}, and you will receive tracking so you can follow your parcel all the way to the door.
        </p>

        <h2>Order tracking</h2>
        <p>
          Every order is dispatched with a tracking reference, which we send to you by email as soon as your parcel leaves us. You can follow its journey at your convenience, and if anything looks delayed you can always ask us.
        </p>

        <h2>Careful packaging</h2>
        <p>
          A reborn doll deserves to travel gently. We wrap every piece with care, so what arrives is the lovely thing you chose &mdash; not a crumpled version of it. If anything ever arrives less than perfect, tell us and we will make it right.
        </p>

        <h2>Delivery times</h2>
        <p>
          We dispatch orders quickly and aim for the full {SITE.deliveryWindow} window on standard UK orders. Delivery estimates are made in good faith and occasionally busier seasons can add a little time &mdash; if it ever does, we will keep you informed rather than leave you guessing.
        </p>

        <h2>Returns &amp; further help</h2>
        <p>
          If you change your mind, our <a href="/returns-policy">returns policy</a> covers your 14-day right to cancel. For any delivery question at all, email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.
        </p>
      </div>
    </div>
  );
}