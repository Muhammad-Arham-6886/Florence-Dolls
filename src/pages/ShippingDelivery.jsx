import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';
import './shipping.css';

export default function ShippingDelivery() {
  return (
    <div className="page container">
      <SEO {...SEO_META.shipping} />
      <p className="page__eyebrow">Getting your piece home</p>
      <h1>Shipping &amp; Delivery</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          At Florence Dolls, we believe in transparent pricing, reliable UK delivery, and a straightforward
          shopping experience. Unlike many overseas retailers, all of our products are dispatched from our
          UK fulfilment facility, helping to reduce delivery times and eliminate unexpected customs charges.
        </p>

        <h2>UK Stock &amp; Dispatch</h2>
        <p>
          We work hard to keep our products in stock and ready for dispatch from our UK warehouse.
        </p>
        <p>
          If an item is temporarily unavailable after an order has been placed, our customer support team
          will contact you promptly via email or telephone with an estimated delivery date.
        </p>
        <p>
          Every order is carefully packed and dispatched using trusted UK courier services with full tracking.
        </p>

        <h2>Saturday Delivery</h2>
        <p>
          Delivery will take place on the soonest available Saturday based on the product&rsquo;s lead time.
        </p>
        <p>
          For in-stock items, order before 3:00pm on Friday for delivery on the next available Saturday.
        </p>

        <h2>Delivery Charges by Area</h2>
        <div className="shipping-table-wrap">
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Delivery Service</th>
                <th>Delivery Time</th>
                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Area">UK Mainland</td>
                <td data-label="Delivery Service">Standard Delivery</td>
                <td data-label="Delivery Time">3&ndash;5 Working Days</td>
                <td data-label="Charge">FREE on orders over &pound;70, otherwise &pound;5.99</td>
              </tr>
              <tr>
                <td data-label="Area">UK Mainland</td>
                <td data-label="Delivery Service">Express Delivery</td>
                <td data-label="Delivery Time">Next Working Day</td>
                <td data-label="Charge">&pound;5.99</td>
              </tr>
              <tr>
                <td data-label="Area">Scottish Highlands &amp; Scottish Islands</td>
                <td data-label="Delivery Service">Standard Delivery</td>
                <td data-label="Delivery Time">2 Working Days</td>
                <td data-label="Charge">&pound;19.95</td>
              </tr>
              <tr>
                <td data-label="Area">Northern Ireland</td>
                <td data-label="Delivery Service">Standard Delivery</td>
                <td data-label="Delivery Time">2 Working Days</td>
                <td data-label="Charge">&pound;24.95</td>
              </tr>
              <tr>
                <td data-label="Area">Isle of Man, Isle of Wight &amp; Scilly Isles</td>
                <td data-label="Delivery Service">Standard Delivery</td>
                <td data-label="Delivery Time">2 Working Days</td>
                <td data-label="Charge">&pound;21.95</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Applicable Postcodes</h3>
        <ul>
          <li><strong>Scottish Highlands</strong> AB31&ndash;38, AB41&ndash;56, FK17&ndash;21, IV1&ndash;39, IV52&ndash;54, IV63, KW0&ndash;14, PH15&ndash;41, PH49&ndash;50.</li>
          <li><strong>Scottish Islands</strong> HS1&ndash;9, IV40&ndash;51, IV55&ndash;59, KA27&ndash;28, KW15&ndash;17, PA20, PA41&ndash;78, PH42&ndash;44, ZE1&ndash;3.</li>
          <li><strong>Northern Ireland</strong> All BT postcodes.</li>
          <li><strong>Scilly Isles</strong> TR21, TR22, TR23, TR24 and TR25.</li>
          <li><strong>Isle of Man</strong> All IM postcodes.</li>
          <li><strong>Isle of Wight</strong> PO30&ndash;PO41.</li>
        </ul>

        <h2>Order Tracking</h2>
        <p>
          Once your order has been dispatched, you will receive a shipping confirmation email containing
          your tracking information (where available), allowing you to monitor your delivery from dispatch
          to arrival.
        </p>

        <h2>Delivery Information</h2>
        <p>
          Estimated delivery times begin once your order has been dispatched. While we aim to deliver
          within the stated delivery windows, delays may occasionally occur due to circumstances beyond
          our control, including:
        </p>
        <ul>
          <li>Severe weather conditions</li>
          <li>Public holidays</li>
          <li>Courier network delays</li>
          <li>High seasonal demand</li>
        </ul>
        <p>
          We appreciate your patience during these periods and will always endeavour to keep you informed
          of any significant delays.
        </p>

        <h2>Need Assistance?</h2>
        <p>
          If you have any questions regarding your order or delivery, our UK customer support team is here
          to help.
        </p>
        <p>
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </div>
    </div>
  );
}
