import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function ReturnsPolicy() {
  return (
    <div className="page container">
      <SEO {...SEO_META.returns} />
      <p className="page__eyebrow">After your order</p>
      <h1>Refund &amp; Returns Policy</h1>

      <div className="reading reading--wide">
        <p className="page__lead">Effective Date: June 13, 2026</p>

        <p>
          At Florence Dolls ({SITE.url}), we are committed to providing completely clear, transparent,
          and fair operational terms for both our direct retail consumers and our approved wholesale
          trade partners. Because we hold 100% of our physical stock inside our West Yorkshire
          logistics center, we can quickly verify, manage, and process all fulfillment entries cleanly.
        </p>
        <p>Please read the following policy rules carefully before placing your order.</p>

        <h2>1. Retail Returns Policy (Standard Consumer Orders)</h2>
        <p>
          Retail customers preserve the right to return eligible items within 14 days of receiving
          their tracked parcel delivery.
        </p>
        <p>
          <strong>Condition Requirements:</strong> To safely qualify for an exchange or refund credit,
          returned items must be completely unused, unopened, and kept inside their original branded
          European manufacturer packaging (Arias or Llorens). All security tags, clear factory seals,
          and identity labels must remain perfectly intact.
        </p>
        <p>
          <strong>Submission Details:</strong> Proof of purchase is strictly required. Please include
          your full name, physical delivery address, active contact phone number or email address, and
          a brief explanation detailing your reason for the return.
        </p>
        <p>
          <strong>Return Logistics:</strong> All returns must be shipped back using a tracked or
          recorded domestic delivery service. Return postage expenses are the exclusive financial
          responsibility of the shopper, unless the item arrived with a clear structural defect or
          was dispatched in error by our warehouse team.
        </p>
        <p>
          <strong>Rejection Clause:</strong> Items returned used, explicitly altered, or stripped of
          their authentic protective boxes cannot be accepted and will be shipped back to the sender.
        </p>

        <h2>2. Mandatory 48-Hour Fault &amp; Damage Reporting Window</h2>
        <p>
          Any flawed, damaged-in-transit, or incorrect retail items must be formally reported to our
          Bradford customer service desk within 48 hours of delivery.
        </p>
        <p>
          <strong>To File a Report:</strong> Please send an immediate notification to{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call our support line on{' '}
          {SITE.phone}.
        </p>
        <p>
          <strong>Required Evidence:</strong> Your submission must include your unique order reference
          number, a clear description of the mechanical or structural flaw, and high-resolution
          photographs detailing the precise issue along with the condition of the external transit
          shipping carton.
        </p>
        <p>
          <strong>Resolution:</strong> Our Bradford warehouse specialists will evaluate the data logs
          and coordinate an expedited tracked replacement or matching resolution where applicable.
        </p>

        <h2>3. Wholesale &amp; Trade Purchases (Strict Final Sale)</h2>
        <p>
          All wholesale and trade purchases processed through approved business accounts are Final
          Sale. As a dedicated UK wholesale distributor holding high-tier domestic stock, we supply
          certified brand inventory directly to independent retail shops and boutiques under premium
          pricing agreements. Consequently, all approved trade partners are fully responsible for
          managing any secondary customer services, refunds, or product exchanges directly with their
          respective end customers.
        </p>
        <p>
          <strong>Cancellation &amp; Amendment Lock:</strong> Once a wholesale purchase ticket has
          been finalized and processed at our Bradford facility, it cannot be edited, cancelled,
          returned, or refunded.
        </p>
        <p>
          <strong>Trade Accuracy Responsibility:</strong> Retail partners hold full accountability
          for reviewing all pending purchase screens closely before verifying checkouts. This includes
          assessing exact product numbers, volume totals, pricing metrics, and targeted business
          shipping addresses.
        </p>

        <h2>4. Transit Damages &amp; Shortages in Wholesale Log Entries</h2>
        <p>
          If a bulk wholesale shipment sustains damage during domestic freight transit, or if an
          incorrect brand compilation is checked into your inventory, the trade partner must contact
          us within 48 hours of delivery.
        </p>
        <p>
          <strong>Submission Mandate:</strong> Please email your account manager directly or phone our
          main workspace at {SITE.phone} with your corporate business details, invoice number, and
          clear digital photographs proving the structural transit damage or packing error.
        </p>
        <p>
          <strong>Evaluation Framework:</strong> Claims are systematically audited on an individual
          basis. Any logistical resolutions, including factory item replacements or wholesale store
          credits, are issued solely at our strict corporate discretion.
        </p>
        <p>
          <strong>Warehouse Integrity Rules:</strong> To remain valid for an account audit review, the
          item must be untouched, completely unhandled, and stored securely inside its original
          branded European packaging. Any products that have been unboxed, placed on open display
          shelves, modified, or repackaged will lose their eligibility for verification.
        </p>

        <h2>5. Outbound Shipping Charges</h2>
        <p>
          All outbound delivery fees and associated shipping charges are completely non-refundable.
          If a retail refund is officially authorized and processed by our financial account handlers,
          the original priority delivery surcharge will be systematically deducted from the final
          repayment balance, unless otherwise required by UK commercial law or agreed upon in a
          written contract from our directors.
        </p>

        <h2>6. Statutory Policy Agreement</h2>
        <p>
          By executing a checkout request or validating an invoice with Florence Dolls, your action
          serves as a formal acknowledgment that you have read, completely understood, and agreed to
          be legally bound under the guidelines of this Refund and Returns Policy.
        </p>

        <h2>7. Direct Local Support Enquiries</h2>
        <p>
          If you require explicit clarification on our return protocols, or need to log an active
          delivery issue, connect directly with our local West Yorkshire support team:
        </p>
        <ul>
          <li><strong>Trading Brand Identity:</strong> Florence Dolls ({SITE.url})</li>
          <li><strong>Legal Corporate Registry:</strong> Registered in England &amp; Wales | Company No. {SITE.companyNo}</li>
          <li><strong>Direct Office Telephone Desk:</strong> {SITE.phone} (Mon&ndash;Fri, standard business hours)</li>
          <li><strong>Monitoring Desk Mailbox:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
      </div>
    </div>
  );
}
