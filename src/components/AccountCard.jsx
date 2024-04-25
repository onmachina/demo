import UseEscape from '../hooks/useEscape';
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom';

export default function AccountCard() {
  const navigate = useNavigate();

  const { username } = useRouteLoaderData('root');
  const { avatarUrl } = useRouteLoaderData('root');

  UseEscape(() => {
    navigate(`/`);
  });

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex justify-end px-4 pt-4">
        <Link to="/">Close</Link>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={avatarUrl} alt="Avatar" />
        <h5 className="mb-1 text-xl font-medium text-gray-900">{username}</h5>
        <span className="text-sm text-gray-500 ">Decentral Infra User</span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <Link
            to="/logout"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
