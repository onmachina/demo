import Logo from './svgs/OnMachinaLogo.jsx';
import PrimaryNavigation from './PrimaryNavigation';
import AccountBar from './AccountBar.jsx';

export default function Layout({ children, wallet, accountId }) {
  return (
    <div className="flex h-screen">
      <div className="pt-4 w-[6em] h-full bg-ui-base border-r border-ui-base flex flex-col items-center">
        <Logo />
        <PrimaryNavigation />
      </div>
      <div className="flex-1 h-full bg-ui-base">
        <AccountBar wallet={wallet} accountId={accountId} />
        {children}
      </div>
    </div>
  );
}
