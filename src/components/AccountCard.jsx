import NearLogo from '../assets/near-logo.png';
import UseEscape from '../hooks/useEscape';
import { Link, useNavigate } from 'react-router-dom';

export default function AccountCard({ wallet, accountId }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    wallet.signOut();
  };

  UseEscape(() => {
    navigate(`/`);
  });

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-4">
        <Link to="/">Close</Link>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={NearLogo} alt="Near Logo" />
        <h5 className="mb-1 text-xl font-medium text-gray-900">{accountId}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">Near Wallet</span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <a
            onClick={handleSignOut}
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}
