import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function PrivacyPolicy() {
  return (
    <div className="page container">
      <SEO {...SEO_META.privacy} />
      <p className="page__eyebrow">Legal &amp; trust</p>
      <h1>Privacy Policy</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          We value your trust, and this policy simply explains how Florence Dolls collects, uses and looks after your personal information. It is written plainly on purpose.
        </p>

        <h2>Who we are</h2>
        <p>
          Florence Dolls is a small UK family business, registered in England and Wales under Company No. {SITE.companyNo}. We are the data controller for the personal information described here. You can reach us at{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Information you give us directly &mdash; your name, email address, phone number and order or message details when you place an order, contact us or open a trade account.</li>
          <li>Order and delivery information &mdash; the address your parcel travels to and the records we need to complete and support your purchase.</li>
          <li>Basic technical information &mdash; such as the device and pages you use on our website, used to keep the site working well.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To process and deliver your orders, and to help you with them afterwards.</li>
          <li>To answer your questions and run your trade account.</li>
          <li>To keep the website secure, working, and fair to all our customers.</li>
          <li>To send you order updates &mdash; never more than you expect, and always with an easy way to stop.</li>
        </ul>

        <h2>Legal grounds</h2>
        <p>
          We rely on the legitimate interests of running a safe and useful shop, on the performance of our contract with you when you order, and on your consent where we ask for it. We do not sell your data to anyone.
        </p>

        <h2>Who we share with</h2>
        <p>
          Only the people who need to be involved in making your order work &mdash; such as our delivery partners who carry your parcel and the payment processors who handle your checkout securely. They are bound to use it only for that purpose.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep order records for as long as we need to support you, meet legal and tax duties, and answer any questions that may arise. Marketing choices are respected whenever you change them.
        </p>

        <h2>Your rights</h2>
        <p>
          Under UK data protection law you can ask to see the information we hold about you, correct it, or ask us to delete or restrict it. To make any of these requests, simply write to{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will act promptly.
        </p>

        <h2>Cookies</h2>
        <p>
          Our website uses cookies to remember your basket and preferences and to understand how the site is used. You can manage or block cookies through your browser at any time.
        </p>

        <h2>Contact</h2>
        <p>
          If you have a question about this policy, or a concern about your data, please email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We aim to respond within one working day.
        </p>
      </div>
    </div>
  );
}