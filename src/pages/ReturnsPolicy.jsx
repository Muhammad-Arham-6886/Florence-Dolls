import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function ReturnsPolicy() {
  return (
    <div className="page container">
      <SEO {...SEO_META.returns} />
      <p className="page__eyebrow">After your order</p>
      <h1>Returns &amp; Refund Policy</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          Buying a reborn doll should feel safe, and it is. Under UK distance-selling rules you have 14 days to change your mind, and Florence Dolls honours that without fuss.
        </p>

        <h2>Your 14-day right to cancel</h2>
        <p>
          When you order online, you have a legal right to cancel your purchase within 14 days of receiving your item. You do not need a reason. If you would like to return a piece, simply tell us within those 14 days &mdash; a quick email to{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> is all it takes.
        </p>

        <h2>How to return an item</h2>
        <ol>
          <li>Contact us within 14 days of receipt to let us know you are returning the item.</li>
          <li>Pack the doll (and any original packaging and accessories) carefully, just as you would like to receive it.</li>
          <li>Send it back to the address we give you, ideally with a tracked service so it is safe on its way.</li>
        </ol>

        <h2>Refunds</h2>
        <p>
          Once your return arrives and is checked, we will refund the amount you paid for the item (including the standard delivery charge, where applicable) to your original payment method. Refunds are issued without undue delay and, in any event, within 14 days of us receiving your item back. Please allow a few extra days for your bank or card provider to show the money.
        </p>

        <h2>A few fair notes</h2>
        <ul>
          <li>You are responsible for the cost of returning the item, unless we agreed otherwise.</li>
          <li>Please take reasonable care of the item while it is in your possession, so it comes back in a re-sellable condition.</li>
          <li>If your item arrives damaged or faulty, tell us straight away with a photo and we will make it right &mdash; repair, replacement or refund, whichever suits you best.</li>
        </ul>

        <h2>Items that cannot be returned</h2>
        <p>
          For hygiene reasons, items that have been used in a way that affects their condition (for example, heavily soiled or damaged through misuse) may not be accepted for return. Genuinely unopened and unused items are always welcome back.
        </p>

        <h2>Still deciding?</h2>
        <p>
          If you are unsure about a piece before it arrives, please write to us &mdash; we are a family business and would far rather talk it through than have you worry. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.
        </p>
      </div>
    </div>
  );
}