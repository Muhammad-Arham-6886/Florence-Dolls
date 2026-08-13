import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SEO_META from '../data/seo';

const commitments = [
  {
    title: 'The promise of genuine stock',
    text: 'Every doll we sell is an authentic Arias or Llorens piece, honestly described and held in UK stock. If we cannot stand wholly behind something, we do not list it.',
  },
  {
    title: 'A price we stand by',
    text: 'We keep our prices fair, and our sale price is never a theatre trick. What you see is what you pay, with nothing hidden at the checkout.',
  },
  {
    title: 'A delivery we keep',
    text: 'We promise fast handling on every order. Your piece is packed with care and dispatched promptly, arriving within our usual 2\u20133 day window, with tracking the whole way.',
  },
  {
    title: 'A listening ear',
    text: 'Even after the box is opened and your doll is home, we are still a family. Ask anything, and we will answer honestly, promptly and warmly.',
  },
];

export default function OurCommitments() {
  return (
    <div className="page container">
      <SEO {...SEO_META.commitments} />
      <p className="page__eyebrow">What we stand on</p>
      <h1>Our Commitments</h1>
      <div className="reading reading--wide">
        <p className="page__lead">
          Florence Dolls is a business run by a family, and so it behaves like one &mdash; we make promises we intend to keep, and we say plainly how we mean to treat every customer and every order.
        </p>

        <div className="commit-list">
          {commitments.map((c) => (
            <div className="commit-item" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <h2>The documents that back the promises</h2>
        <p>
          The fair terms on which we trade &mdash; delivery, your returns and privacy &mdash; are always open for you to read:
        </p>
        <ul>
          <li><Link to="/shipping-delivery">Shipping &amp; Delivery</Link></li>
          <li><Link to="/returns-policy">Returns &amp; Refund Policy</Link></li>
          <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
        </ul>

        <p>
          Should anything ever fall short of these words, we would rather hear from you than lose you. Write to us on our{' '}
          <Link to="/contact">contact page</Link> and we will do right by it.
        </p>
      </div>
    </div>
  );
}