import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function TermsConditions() {
  return (
    <div className="page container">
      <SEO {...SEO_META.terms} />
      <p className="page__eyebrow">Legal &amp; trust</p>
      <h1>Terms &amp; Conditions</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          These are the fair terms on which Florence Dolls trades. Please read them before placing an order so everything is clear between us from the start.
        </p>

        <h2>About these terms</h2>
        <p>
          Florence Dolls is a UK business registered under Company No. {SITE.companyNo}. By placing an order, you accept these terms. If there is any conflict between these terms and the information on our website, these terms take precedence.
        </p>

        <h2>Orders and payment</h2>
        <p>
          All orders are subject to confirmation and availability. We aim to confirm your order promptly after you place it. Payment is taken securely at checkout, and we never see or store your full payment details &mdash; they are handled by our secure payment processor.
        </p>

        <h2>Pricing</h2>
        <p>
          Prices are shown as they should be at checkout, with delivery and any applicable tax added clearly. We make every effort to list accurate prices, but we reserve the right to correct obvious errors where a displayed price is clearly wrong, and we will always tell you before taking payment.
        </p>

        <h2>Availability and stock</h2>
        <p>
          Once you place an order we treat your item as reserved for you. If a piece is collecting and we are waiting on stock, we will tell you honestly and keep you updated &mdash; never leaving you in the dark.
        </p>

        <h2>Delivery</h2>
        <p>
          All orders are dispatched from UK stock. Delivery times are estimates and we do our best to meet them; full details are on our{' '}
          <a href="/shipping-delivery">shipping &amp; delivery</a> page.
        </p>

        <h2>Cancellation and returns</h2>
        <p>
          You have a legal right to change your mind within 14 days, and our returns policy <a href="/returns-policy">explains how it works</a>.
        </p>

        <h2>Our responsibility</h2>
        <p>
          Nothing in these terms affects your legal rights. We are responsible for damage or loss that we cause by being negligent, and we never limit liability that cannot legally be limited &mdash; including for death or injury caused by our negligence.
        </p>

        <h2>Company details</h2>
        <p>
          Florence Dolls, Company No. {SITE.companyNo}. Contact us by email at{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or by phone on {SITE.phone}.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of England and Wales. Any dispute will be subject to the non-exclusive jurisdiction of the courts of England and Wales.
        </p>
      </div>
    </div>
  );
}