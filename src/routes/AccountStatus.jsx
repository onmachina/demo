import UseEscape from '../hooks/useEscape';
import { Link, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import { auth0AuthProvider } from '../auth';
import { Children } from 'react';

export const AccountStatus = function AccountStatus() {
  const navigate = useNavigate();

  const { username, emailVerified, activeSubscription } = useLoaderData();

  UseEscape(() => {
    navigate(`/`);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center m-4">
          <div className="my-4 text-center">
            <h5 className="mb-1 text-xl font-medium text-gray-900">
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

          <div className="flex mt-4 space-x-3 md:mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
            >
              Continue to the application
            </Link>
          </div>
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
          stroke-width="1.5"
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
    <div className="rounded-lg m-4 w-full flex gap-2  items-start py-3 px-4 bg-green-100 bg-opacity-50 text-green-700 border border-green-300 sm:items-center">
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
