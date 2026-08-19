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
        <p className="page__lead">Last Updated: June 13, 2026</p>

        <p>
          These Terms &amp; Conditions govern the use of the Florence Dolls website ({SITE.url})
          and the purchase of any products from our store. By accessing this website, registering an
          account, or placing a retail or wholesale order, you agree to comply with and be strictly
          bound by these terms.
        </p>

        <h2>1. About Us</h2>
        <p>
          Florence Dolls is a trading identity of our legally registered UK business entity. We are
          premier domestic distributors and official stockists of authentic, premium
          European-manufactured dolls (including genuine Arias and Llorens collections), supplying
          retail shops, independent boutiques, nurseries, and verified trade partners.
        </p>
        <ul>
          <li><strong>Company Registration Number:</strong> Registered in England | Company No. {SITE.companyNo}</li>
          <li><strong>Direct Corporate Phone Line:</strong> {SITE.phone}</li>
          <li><strong>Official Support Communications:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
        <p>
          We reserve the absolute operational right to modify, adjust, or update these Terms &amp;
          Conditions at any time. Any changes will be updated dynamically on this page and will take
          immediate commercial effect upon publication.
        </p>

        <h2>2. Use of the Website</h2>
        <p>
          By interacting with this platform, you firmly agree to use it exclusively for lawful
          business purposes and in a manner that does not infringe upon, restrict, or inhibit the
          marketplace rights of others.
        </p>
        <p>
          You must not introduce viruses, trojans, worms, logic bombs, or other malicious digital
          assets, nor attempt to gain unauthorized entry to our secure hosting servers, databases,
          or West Yorkshire facility networks.
        </p>
        <p>
          We reserve the formal right to suspend, restrict, or permanently terminate your interface
          access if we have reasonable grounds to believe a user has bypassed or violated these
          contractual terms.
        </p>

        <h2>3. Retailer &amp; Trade Accounts</h2>
        <p>
          To unlock wholesale opportunities, trade-only tier pricing, or deep custom pipelines,
          users must apply for a secure Trade Account.
        </p>
        <p>
          By filling out our wholesale profile layout, you guarantee that all submitted legal entity
          fields, VAT details, and contact pointers are current, accurate, and completely verifiable.
        </p>
        <p>
          Account owners hold complete accountability for securing the secrecy of their digital login
          credentials and are responsible for all purchase actions submitted under their trade
          profile.
        </p>
        <p>
          We reserve full authority to manually review, authorize, reject, or suspend trade account
          access at our strict operational discretion.
        </p>

        <h2>4. Product Authenticity &amp; Inventory Integrity</h2>
        <p>
          We enforce a strict commitment to marketplace honesty: the doll displayed in our studio
          photography is the exact authentic model you will receive. We trade exclusively in fully
          safety-tested, genuine branded products imported from formal European channels.
        </p>
        <p>
          While we make every effort to display true structural detailing, minor variations in fabric
          batches, eye refraction, or manufacturer presentation styles may occasionally occur.
        </p>
        <p>
          Unlike dropshipping networks or overseas speculative storefronts, 100% of our active stock
          is held physically in the UK. Product presence is tied directly to real-time warehouse data.
          We reserve the right to modify availability limits or retire collections without prior
          notice.
        </p>

        <h2>5. Pricing Frameworks</h2>
        <p>
          All trade and retail prices displayed on {SITE.url} are managed dynamically and are subject
          to change without notice based on standard importation indices or manufacturer shifting
          rates.
        </p>
        <p>
          Prices will clearly indicate whether they are exclusive or inclusive of statutory UK taxes
          (VAT) depending on your authorized profile status (Trade Account vs. Standard Visitor).
          Trade partners remain fully responsible for handling their local tax compliance metrics.
        </p>
        <p>
          We reserve the right to correct any clear numerical pricing or processing errors across
          our storefront layout at any point. If a system pricing bug affects an active order, our
          Bradford account team will contact you immediately to rectify the error before inventory
          leaves our warehouse.
        </p>

        <h2>6. Order Placement &amp; Contract Acceptance</h2>
        <p>
          When you complete a checkout request on our website, your submission constitutes a formal
          legal offer to purchase the specified inventory under these terms.
        </p>
        <p>
          A contract is only finalized once our facility team verifies physical stock availability,
          confirms secure payment clearing, and issues a tracking-enabled transaction receipt.
        </p>
        <p>
          We maintain the complete operational right to cancel or refuse any checkout entry for
          reasons including limited stock capacity, unapproved payment authorizations, or high-risk
          indicators highlighted by our anti-fraud screening systems.
        </p>

        <h2>7. Tracked Shipping &amp; Warehouse Fulfillment</h2>
        <p>
          Because we do not depend on international shipping lanes or drop-shippers, all orders are
          processed and handled directly from our fulfillment hub in Bradford.
        </p>
        <p>
          <strong>Guaranteed Fast Dispatch:</strong> Packages are prepared for rapid transit and
          delivered securely within 2&ndash;3 working days across the UK using trusted domestic
          tracked carriers.
        </p>
        <p>
          Delivery dates provided during checkout are realistic operational estimates. While we
          maintain a highly consistent delivery rate, we cannot be held responsible for unexpected
          third-party transit strikes, extreme weather occurrences, or force majeure events.
        </p>

        <h2>8. Returns, Damages, &amp; Refund Rights</h2>
        <p>
          Returns and exchanges are handled transparently by our Bradford customer support team in
          strict compliance with UK commercial regulations.
        </p>
        <p>
          If your business receives a defective, structurally damaged, or incorrect manufacturer
          shipment, you must contact our office line on {SITE.phone} or notify us via email within a
          reasonable period after parcel delivery.
        </p>
        <p>
          To qualify for a regular return or inventory restocking credit, products must be returned
          completely unused, unaltered, and securely packed inside their original branded European
          manufacturer packaging.
        </p>

        <h2>9. Intellectual Property Protection</h2>
        <p>
          All media materials and text assets visible on this site&mdash;including layout graphics,
          product names, logos, written descriptions, custom code strings, and studio
          photography&mdash;are the exclusive property of Florence Dolls or our Spanish manufacturing
          partners.
        </p>
        <p>
          Any unauthorized downloading, reproduction, republication, distribution, or commercial
          reuse of our media files or brand identifiers without express written authorization from
          our UK headquarters is strictly prohibited and protected under corporate copyright laws.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the absolute extent permitted under United Kingdom commercial law, Florence Dolls shall
          not be held liable for any indirect, incidental, or consequential business losses, loss of
          store revenue, data corruption, or inventory downtime resulting from the navigation of this
          website or the retail use of our products.
        </p>
        <p>
          Our total aggregate liability for any legitimate claim linked directly to a product order
          is strictly limited to the exact financial sum successfully processed and received by us for
          that specific order transaction.
        </p>

        <h2>11. Privacy &amp; Data Handling</h2>
        <p>
          Your system use and data transmissions are governed concurrently under our comprehensive{' '}
          <a href="/privacy-policy">Privacy Policy</a>, which defines how our West Yorkshire
          operations collect, protect, and process consumer and business data under strict UK
          General Data Protection Regulation (UK GDPR) mandates.
        </p>

        <h2>12. Governing Law and Jurisdiction</h2>
        <p>
          These Terms &amp; Conditions, along with all associated checkout contracts, shall be
          governed by, interpreted, and enforced in accordance with the laws of England &amp; Wales.
          Any legal disputes or statutory claims arising out of your business relationship with our
          brand shall be subject to the exclusive jurisdiction of the courts of the United Kingdom.
        </p>

        <h2>13. Direct Assistance &amp; Contact Enquiries</h2>
        <p>
          If you require immediate clarification on any section of these Terms &amp; Conditions, or
          need swift technical assistance regarding a wholesale shipment, please reach out directly to
          our UK office:
        </p>
        <ul>
          <li><strong>By Phone:</strong> Call our team on {SITE.phone} (Open Monday to Friday during standard UK business hours)</li>
          <li><strong>By Email:</strong> Contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
      </div>
    </div>
  );
}
