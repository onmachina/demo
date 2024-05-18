import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

export default function Checkout() {
  const { clientSecret } = useLoaderData();

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!clientSecret) {
        return;
      }

      // client-safe stripe "publishable" API key
      const stripe = await loadStripe(
        'pk_test_51OkWELDS1kjgsFiFxMUkKroMrTOOiJKZ1UjHpJ5NON4CW7jlmKMZ7fcZrdvxHqHPqDn66YyCUhzoAl24sEq53NkL00OW4PGwzc',
      );

      // Initialize Checkout
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });

      // Mount Checkout
      checkout.mount('#checkout');
    };

    initializeCheckout();
  }, [clientSecret]);

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-3/4">
        <div id="checkout"></div>
      </div>
    </div>
  );
}
