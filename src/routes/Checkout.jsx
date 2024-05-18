import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

export const Checkout = function () {
  const { stripe_client_secret, stripe_session_id } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!stripe_client_secret) {
        return;
      }

      // client-safe stripe "publishable" API key
      const stripe = await loadStripe(
        'pk_test_51OkWELDS1kjgsFiFxMUkKroMrTOOiJKZ1UjHpJ5NON4CW7jlmKMZ7fcZrdvxHqHPqDn66YyCUhzoAl24sEq53NkL00OW4PGwzc',
      );

      // Initialize Checkout
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: stripe_client_secret });

      // Mount Checkout
      checkout.mount('#checkout');

      // Listen for payment completion event
      checkout.addEventListener('complete', () => {
        // Payment completed successfully, redirect the user
        navigate(`/finish-checkout?session_id=${stripe_session_id}`);
      });
    };

    initializeCheckout();
  }, [stripe_client_secret]);

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-3/4">
        <div id="checkout"></div>
      </div>
    </div>
  );
};
