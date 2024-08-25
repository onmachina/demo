import UseEscape from '../hooks/useEscape';
import { useNavigate, useLoaderData, redirect } from 'react-router-dom';
import { authProvider } from '../../lib/auth';
import { DecentralLogo } from '../components/DecentralLogo';
import { ButtonLink } from '../components/Button';

export const AccountStatus = function AccountStatus() {
  const navigate = useNavigate();

  const { username, emailVerified, activeSubscription } = useLoaderData();

  UseEscape(() => {
    navigate(`/`);
  });

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50 bg-ui-base">
      <div className="w-full flex-1 p-8 order-1 shadow-lg ui-panel bg-ui-active text-white max-w-lg mx-auto border border-ui-base">
        <div className="mb-4 mx-auto w-16">
          <DecentralLogo />
        </div>
        <div className="my-4 text-center mb-8">
          <h5 className="mb-1 text-2xl font-medium text-white">
            {emailVerified && activeSubscription ? 'You are all set!' : 'Account setup'}
          </h5>
          <div className=" text-gray-400 ">{username}</div>
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
          <ButtonLink bg="active" to="/">
            Continue to the applicaiton
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};

const Incomplete = (props) => {
  return (
    <div className="flex gap-3  items-full py-3 px-4  text-gray-400">
      <div className="text-red-300 bg-red-900 bg-opacity-20 rounded-md p-2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <p className="text-white">{props.titleText}</p>
        {props.children}
      </div>
    </div>
  );
};

const Complete = (props) => {
  return (
    <div className="flex gap-3  items-full py-3 px-4  text-gray-400">
      <div className="text-emerald-300 bg-emerald-900 bg-opacity-20 rounded-md p-2 flex items-center">
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
        <p className="text-white">{props.titleText}</p>
        {props.children}
      </div>
    </div>
  );
};

export async function loader() {
  const isAuthenticated = await authProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  await authProvider.refreshToken();

  const user = await authProvider.getUser();
  const username = user.username;
  const token = user.accessToken.value;
  const emailVerified = user.emailVerified;
  const activeSubscription = user.hasSubscription;

  return { token, username, emailVerified, activeSubscription };
}
