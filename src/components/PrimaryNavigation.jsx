import { HiOutlineSquares2X2, HiOutlineCube, HiOutlineCog } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <ul className="mt-8 text-ui-muted text-sm">
      <li>
        <Link to="/shard-list">
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineSquares2X2 size={22} />
          </div>
          <span className="block text-center mb-8">Shards</span>
        </Link>
      </li>
      <li>
        <Link to="/">
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineCube size={22} />
          </div>
          <span className="block text-center mb-8">Containers</span>
        </Link>
      </li>
      <li>
        <a href="/settings">
          <div className="rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1">
            <HiOutlineCog size={22} />
          </div>
          <span className="block text-center mb-8">Settings</span>
        </a>
      </li>
    </ul>
  );
}
