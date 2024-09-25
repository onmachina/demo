import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

export function ErrorWindow() {
  const error = useRouteError();
  console.error(error);

  let ErrorComponent;

  if (error?.data?.code === 'ERR_EMAIL_NOT_VERIFIED') {
    ErrorComponent = React.lazy(() => import('./EmailNotVerified.jsx'));
  } else if (error?.status == 402) {
    ErrorComponent = React.lazy(() => import('./NotSubscribed.jsx'));
  } else if (error?.data?.code === 'ERR_STATS_UNAVAILABLE') {
    ErrorComponent = React.lazy(() => import('./StatsNotAvailable.jsx'));
  } else {
    ErrorComponent = React.lazy(() => import('./GenericError.jsx'));
  }

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-md shadow-lg ui-panel bg-ui-active text-white border border-ui-base">
        <React.Suspense fallback={<div>Loading...</div>}>
          <ErrorComponent error={error} />
        </React.Suspense>
      </div>
    </div>
  );
}
