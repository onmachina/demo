import Logo from './svgs/OnmachinaLogo.jsx';
import PrimaryNavigation from './PrimaryNavigation';
import AccountBar from './AccountBar.jsx';

export default function Layout({ children, wallet, accountId }) {
  return (
    <div className="flex h-screen">
      <div className="pt-4 w-[6em] h-full bg-gray-100 border-r border-gray-200 flex flex-col items-center">
        <Logo />
        <PrimaryNavigation />
      </div>
      <div className="flex-1 h-full bg-gray-100">
        <AccountBar wallet={wallet} accountId={accountId} />
        {children}
      </div>
    </div>
  );
}
