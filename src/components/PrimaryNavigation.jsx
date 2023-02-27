import { HiOutlineSquares2X2, HiOutlineCube, HiOutlineCog } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <ul className="mt-8 text-gray-500 text-sm">
      <li>
        <a href="#">
          <div className="bg-white rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1 border border-gray-200">
            <HiOutlineSquares2X2 size={22} />
          </div>
          <span className="block text-center mb-8">Shards</span>
        </a>
      </li>
      <li>
        <Link to="/">
          <div className="bg-white rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1 border border">
            <HiOutlineCube size={22} />
          </div>
          <span className="block text-center mb-8">Containers</span>
        </Link>
      </li>
      <li>
        <a href="#">
          <div className="bg-white rounded-full aspect-square w-10 flex justify-center items-center m-auto mt-8 mb-1 border border">
            <HiOutlineCog size={22} />
          </div>
          <span className="block text-center mb-8">Settings</span>
        </a>
      </li>
    </ul>
  );
}
