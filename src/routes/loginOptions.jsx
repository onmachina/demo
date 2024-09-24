import React from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from 'lucide-react';

export function LoginOptions() {
  const navigate = useNavigate();

  const handleAuth0leLogin = () => {
    sessionStorage.setItem('auth.session.type', 'auth0');
    navigate('/login');
  };

  const handleNearLogin = () => {
    sessionStorage.setItem('auth.session.type', 'near');
    navigate('/login');
  };

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-full max-w-md shadow-lg ui-panel bg-ui-active text-white border border-ui-base">
        <div className="flex flex-col items-center p-8 pt-0">
          <div className="m-4 font-bold text-white">Login to Decentral Infra</div>
          <button
            className="mt-0 m-4 flex items-center p-4 text-sm text-blue-800 rounded-sm bg-slate-300 hover:bg-white w-full"
            role="alert"
            onClick={handleAuth0leLogin}
          >
            <User className="h-8 w-8" />
            <div className="ml-4">
              <span className="font-medium text-blue-900">Login with an email / Google account.</span>
            </div>
          </button>
          <button
            className="mt-0 m-4 flex items-center p-4 text-sm text-blue-800 rounded-sm bg-slate-300 hover:bg-white w-full"
            role="alert"
            onClick={handleNearLogin}
          >
            <NearLogo />
            <div className="ml-4">
              <span className="font-medium text-blue-900">Login with your NEAR account.</span>
            </div>
          </button>
          <div className="pt-2 text-sm text-gray-400">If you don't have an account yet, you can create one here.</div>
        </div>
      </div>
    </div>
  );
}

function NearLogo() {
  return (
    <svg width="25" height="25" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8_5)">
        <path
          d="M28.0466 1.78889L20.7436 12.6389C20.2386 13.3778 21.2098 14.2722 21.909 13.65L29.0955 7.38889C29.2897 7.23333 29.5616 7.35 29.5616 7.62222V27.1833C29.5616 27.4556 29.212 27.5722 29.0566 27.3778L7.303 1.32222C6.60377 0.466667 5.59378 0 4.46726 0H3.69034C1.67037 0 0 1.67222 0 3.73333V31.2667C0 33.3278 1.67037 35 3.72919 35C5.0111 35 6.21532 34.3389 6.91454 33.2111L14.2175 22.3611C14.7225 21.6222 13.7514 20.7278 13.0522 21.35L5.8657 27.5722C5.67148 27.7278 5.39956 27.6111 5.39956 27.3389V7.81667C5.39956 7.54444 5.74917 7.42778 5.90455 7.62222L27.6582 33.6778C28.3574 34.5333 29.4062 35 30.4939 35H31.2708C33.3296 35 35 33.3278 35 31.2667V3.73333C35 1.67222 33.3296 0 31.2708 0C29.9501 0 28.7458 0.661111 28.0466 1.78889Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_8_5">
          <rect width="35" height="35" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
