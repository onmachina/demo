import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { DecentralLogo } from '../components/DecentralLogo';

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
        'pk_live_51OkWELDS1kjgsFiFkILU6vic638ZPsSz7TNCbUkEadet1zBp6dRznCTa6jBiNxuLBLeQrCZZ3TtSTcWYrDSYfDji00Dbj9DOZF',
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
    <div className="h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50  lg:flex items-stretch">
      <div className="lg:w-1/2 bg-slate-100 p-8">
        <p className="mx-auto w-10 aspect-square text-2xl text-cyan-400 text-center rounded-full border-cyan-400 border-4 mb-2">
          1
        </p>
        <p className="text-3xl text-center">Review your plan</p>
        <p className="text-center mb-8 text-slate-500 text-lg">Simple monthly subscription. Cancel any time.</p>

        <div className="w-full flex-1 p-8 order-1 shadow-lg rounded-xl bg-white text-gray-400 max-w-lg mx-auto">
          <div className="mb-8 pb-8 flex items-center border-b border-gray-300">
            <DecentralLogo />
            <div className="ml-5">
              <span className="block text-3xl font-semibold text-black">Decentral Infra</span>
              <span>Decentralized Storage Network</span>
            </div>
          </div>
          <ul className="mb-10">
            <li className="flex mb-4">
              <span className="text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <span className="ml-2">
                Unlimited <span className="text-black">storage capacity</span>
              </span>
            </li>
            <li className="flex mb-6">
              <span className="text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <span className="ml-2">
                <span className="text-black">$0 to start</span>—only pay for what you use as you scale
              </span>
            </li>
          </ul>
          <ul className="border border-gray-300 rounded-lg">
            <li className="p-4 border-b border-gray-300">
              <span className="text-black">$0.004/GiB</span> storage
            </li>
            <li className="p-4 ">
              <span className="text-black">$0.007/GiB</span> bandwidth
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2 bg-white text-black p-8">
        <p className="mx-auto w-10 aspect-square text-2xl text-cyan-400 text-center rounded-full border-cyan-400 border-4 mb-2">
          2
        </p>
        <p className="text-3xl text-center text-black">Enter your payment details</p>
        <p className="text-center text-slate-500 mb-8 text-lg">
          Your credit card will not be charged until you incurr usage.
        </p>
        <div id="checkout"></div>
      </div>
    </div>
  );
};
