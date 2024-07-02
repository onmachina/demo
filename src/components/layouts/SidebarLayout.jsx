import Logo from '../svgs/OnMachinaLogo.jsx';
import PrimaryNavigation from '../PrimaryNavigation';
import { Outlet } from 'react-router-dom';
import { auth0AuthProvider } from '../../../lib/auth.ts';
import { useNavigate, redirect, useLoaderData, Link } from 'react-router-dom';
import Banner from '../Banner.jsx';
import { useState, useEffect } from 'react';

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SidebarLayout = function () {
  const { username, avatarUrl, emailVerified } = useLoaderData();

  const [showBanner, setShowBanner] = useState(true);
  const toggleBanner = () => setShowBanner(!showBanner);

  return (
    <div className="flex h-screen">
      {/* Banner */}
      {!emailVerified && showBanner && <Banner action={toggleBanner} />}
      {/* Sidebar */}
      <div className="pt-4 w-[6em] h-full bg-ui-base flex-shrink-0 flex flex-col items-center">
        <div className="fixed pt-5">
          <Logo />
          <PrimaryNavigation />
          <div className="fixed bottom-8 w-[4em]">
            <DropdownMenuDemo />
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 h-full bg-ui-base pt-6 border-l border-ui-base min-h-full">
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
  const emailVerified = await auth0AuthProvider.emailVerified();

  return { username, avatarUrl, emailVerified };
}

function DropdownMenuDemo() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-ui-muted">
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
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => navigate('/usage')}>
          <Cloud className="mr-2 h-4 w-4" />
          <span>Usage</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>{' '}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/logout')}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
