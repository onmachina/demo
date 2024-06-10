import Logo from '../svgs/OnMachinaLogo.jsx';
import PrimaryNavigation from '../PrimaryNavigation';
import AccountBar from '../AccountBar.jsx';
import { Outlet } from 'react-router-dom';

export default function SidebarLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="pt-4 w-[6em] h-full bg-ui-base border-r border-ui-base flex-shrink-0 flex flex-col items-center">
        <div className="fixed pt-5">
          <Logo />
          <PrimaryNavigation />
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 h-full bg-ui-base pt-6">
        <Outlet />
      </div>
    </div>
  );
}
