import { Link } from 'react-router-dom';

export default function ShardCard({ name, decsription, url, isActive }) {
  if (isActive)
    return (
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <a href="#">
          <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{name}</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 ">{decsription}</p>
          <Link
            to={url}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
          >
            Select shard now
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    );

  // diaabled card view
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
      <a href="#">
        <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-400 ">
            {name}
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">Soon</span>
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-400 ">{decsription}</p>
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-300 rounded-lg">
          Select shard
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
}
