import { Link, useRouteLoaderData } from 'react-router-dom';

export default function AccountBar() {
  // Get our logged in user, if they exist, from the root route loader data
  const { username } = useRouteLoaderData('root');
  const { avatarUrl } = useRouteLoaderData('root');

  return (
    <div className="pt-2 flex justify-end w-full">
      <div className="flex items-center space-x-4 mr-4">
        <div className="font-medium">
          <div className="text-right">{username && <Link to="/account/">{username}</Link>}</div>
        </div>
        <Link to="/account/">
          <img className="w-10 h-10 rounded-full" src={avatarUrl} alt="" />
        </Link>
      </div>
    </div>
  );
}
