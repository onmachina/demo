import { HiOutlineSquares2X2, HiOutlineCube, HiOutlineCog, HiOutlineChartBar } from 'react-icons/hi2';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const location = useLocation();
  return (
    <ul className="mt-8 text-ui-muted text-sm">
      <li>
        <Link to="/shard-list" className={`${location.pathname === '/shard-list' ? 'text-ui-base' : ''}`}>
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineSquares2X2 size={22} />
          </div>
          <span className="block text-center mb-8">Shards</span>
        </Link>
      </li>
      <li>
        <Link to="/" className={`${location.pathname === '/' ? 'text-ui-base' : ''}`}>
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineCube size={22} />
          </div>
          <span className="block text-center mb-8">Containers</span>
        </Link>
      </li>
      <li>
        <a href="/settings" className={`${location.pathname === '/settings' ? 'text-ui-base' : ''}`}>
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineCog size={22} />
          </div>
          <span className="block text-center mb-8">Settings</span>
        </a>
      </li>
      <li>
        <a href="/usage" className={`${location.pathname === '/usage' ? 'text-ui-base' : ''}`}>
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineChartBar size={22} />
          </div>
          <span className="block text-center mb-8">Usage</span>
        </a>
      </li>
    </ul>
  );
}
