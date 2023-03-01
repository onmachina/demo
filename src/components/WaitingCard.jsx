import NearLogo from '../assets/near-logo.png';

export default function AccountCard({ wallet, accountId }) {
  const handleSignOut = () => {
    wallet.signOut();
  };

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center pb-10">
          <img className="mt-8 w-24 h-24 mb-3 rounded-full shadow-lg" src={NearLogo} alt="Near Logo" />
          <h5 className="mb-1 text-xl font-medium text-gray-900 ">{accountId}</h5>
          <span className="text-sm text-gray-500 ">Near Wallet</span>
          <div className="m-8 flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Account pending</span> Your account has not yet been set up with OnMachina.
            </div>
          </div>
          <div className="flex mt-4 space-x-3 md:mt-6">
            <a
              onClick={handleSignOut}
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
