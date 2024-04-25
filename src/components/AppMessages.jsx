export function Error() {
  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center pb-10">
          <div className="m-8 flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
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
              <span className="font-medium">Application error.</span> There was an error fulfilling your request.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center pb-10">
          <div className="m-8 flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
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
              <span className="font-medium">Application is loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoggingIn() {
  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center pb-10">
          <div className="m-8 flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
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
              <span className="font-medium">One moment...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
