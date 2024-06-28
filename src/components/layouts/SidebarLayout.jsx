import Logo from '../svgs/OnMachinaLogo.jsx';
import PrimaryNavigation from '../PrimaryNavigation';
import { Outlet } from 'react-router-dom';
import { auth0AuthProvider } from '../../../lib/auth.ts';
import { redirect, useLoaderData, Link } from 'react-router-dom';

export const SidebarLayout = function () {
  const { username, avatarUrl } = useLoaderData();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="pt-4 w-[6em] h-full bg-ui-base border-r border-ui-base flex-shrink-0 flex flex-col items-center">
        <div className="fixed pt-5">
          <Logo />
          <PrimaryNavigation />
          <div className="fixed bottom-8 w-[4em]">
            <Link to="/account-status/" className="hover:text-white text-ui-muted">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Circular Image"
                  className="mx-auto w-12 h-12 rounded-full border-4 border-ui-base shadow-lg"
                ></img>
              )}
              {!avatarUrl && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-10 h-10 mx-auto"
                  width={22}
                  height={22}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 h-full bg-ui-base pt-6">
        <Outlet />
      </div>
    </div>
  );
};

export async function accountLoader() {
  const isAuthenticated = await auth0AuthProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  const username = await auth0AuthProvider.email();
  const avatarUrl = await auth0AuthProvider.avatarUrl();

  return { username, avatarUrl };
}
