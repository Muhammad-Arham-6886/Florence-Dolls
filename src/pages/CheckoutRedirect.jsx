import { useEffect } from 'react';
import SEO from '../components/SEO';
import { WP_REST_URL } from '../config';

// Basket and checkout are handled by the native WordPress storefront for payment.
// The app redirects the customer to the WordPress origin (cart or checkout page).
export default function CheckoutRedirect({ mode }) {
  const isCheckout = mode === 'checkout';

  useEffect(() => {
    const origin = new URL(WP_REST_URL).origin;
    const target = `${origin}/${isCheckout ? 'checkout' : 'cart'}`;
    window.location.assign(target);
  }, [isCheckout]);

  return (
    <div className="page container">
      <SEO
        path={isCheckout ? '/checkout' : '/cart'}
        title={isCheckout ? 'Checkout' : 'Your Basket'}
        description={
          isCheckout
            ? 'Complete your Florence Dolls order securely at our checkout.'
            : 'Review your Florence Dolls basket before checkout.'
        }
      />
      <div className="notice">
        <p>Taking you to our secure {isCheckout ? 'checkout' : 'basket'} now&hellip;</p>
      </div>
    </div>
  );
}