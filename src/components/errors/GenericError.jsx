import { ButtonLink } from '../Button';
export default function GenericError({ error }) {
  return (
    <div className="flex flex-col items-center pb-4">
      <div className="m-4 mb-0 font-bold text-white">Something went wrong</div>
      <div className="m-4 flex p-4 mb-4 text-sm text-blue-800 rounded-sm bg-blue-300 " role="alert">
        <svg
          aria-hidden="true"
          className="flex-shrink-0 inline w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <p>
            <span className="font-medium">Application error.</span> There was an error fulfilling your request.
          </p>
          <p className="mt-2">
            <i className="text-blue-800 opacity-70">
               ({error.status}, {error.data || error.statusText || error.message})
            </i>
          </p>
        </div>
      </div>
      <div className="p-4 pb-0 w-full">
        <ButtonLink bg="active" to="/">
          Back to application
        </ButtonLink>
      </div>
    </div>
  );
}
