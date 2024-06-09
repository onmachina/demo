import UseEscape from '../hooks/useEscape';
import { Link, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import { auth0AuthProvider } from '../../lib/auth';
import { Children } from 'react';
import { DecentralLogo } from '../components/DecentralLogo';

export const AccountStatus = function AccountStatus() {
  const navigate = useNavigate();

  const { username, emailVerified, activeSubscription } = useLoaderData();

  UseEscape(() => {
    navigate(`/`);
  });

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50 bg-slate-100">
      <div className="w-full flex-1 p-8 order-1 shadow-lg rounded-xl bg-white text-gray-400 max-w-lg mx-auto">
        <div className="mb-4 mx-auto w-16">
          <DecentralLogo />
        </div>
        <div className="my-4 text-center mb-8">
          <h5 className="mb-1 text-2xl font-medium text-gray-900">
            {emailVerified && activeSubscription ? 'You are all set!' : 'Account setup'}
          </h5>
          <div className=" text-gray-500 ">{username}</div>
        </div>
        {emailVerified ? (
          <Complete titleText="Your email has been verified.">
            <p>Thanks for completing this step!</p>
          </Complete>
        ) : (
          <Incomplete titleText="Your email needs to be verified.">
            <p>Please check your inbox for an email with a link to verify your email.</p>
          </Incomplete>
        )}
        {activeSubscription ? (
          <Complete titleText="Your subscription is active.">
            <p>Looks good from our side!</p>
          </Complete>
        ) : (
          <Incomplete titleText="Hmm... Still waiting for your subscription to get set up.">
            <div>
              <p>
                If this is a new account, you may just need to wait a few additional minnutes for everything to
                complete.
              </p>
            </div>
          </Incomplete>
        )}

        <div className="mx-4 mt-8">
          <Link
            to="/"
            className="block w-full px-4 py-3 text-sm font-medium text-center text-cyan-200 bg-black  rounded-lg  focus:ring-4 focus:outline-none focus:slate-800"
          >
            Continue to the application
          </Link>
        </div>
      </div>
    </div>
  );
};

const Incomplete = (props) => {
  return (
    <div className="rounded-lg m-4 w-full flex gap-2  items-start py-3 px-4 bg-white text-gray-400 border border-gray-200 sm:items-center">
      <div className="text-orange-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <p className="font-bold text-black">{props.titleText}</p>
        {props.children}
      </div>
    </div>
  );
};

const Complete = (props) => {
  return (
    <div className="rounded-lg m-4 flex gap-2  items-start py-3 px-4 bg-green-100 bg-opacity-50 text-green-700 border border-green-300 sm:items-center">
      <div className="text-green-700">
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
      </div>
      <div>
        <p className="font-bold text-green-700">{props.titleText}</p>
        {props.children}
      </div>
    </div>
  );
};

export async function loader() {
  const isAuthenticated = await auth0AuthProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  await auth0AuthProvider.refreshToken();

  const username = await auth0AuthProvider.username();
  const token = await auth0AuthProvider.accessToken();
  const emailVerified = await auth0AuthProvider.emailVerified();
  const activeSubscription = await auth0AuthProvider.hasSubscription();

  return { token, username, emailVerified, activeSubscription };
}
