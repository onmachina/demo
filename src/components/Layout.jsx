import Logo from './svgs/OnMachinaLogo.jsx';
import PrimaryNavigation from './PrimaryNavigation';
import AccountBar from './AccountBar.jsx';
import Banner from './Banner.jsx';
import { useState, useEffect } from 'react';
import { auth0AuthProvider } from '../auth';

export default function Layout({ children }) {
  const [emailVerified, setEmailVerified] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const toggleBanner = () => setShowBanner(!showBanner);

  async function checkEmailVerified() {
    const emailVerified = await auth0AuthProvider.emailVerified();
    setEmailVerified(emailVerified);
  }

  useEffect(() => {
    checkEmailVerified();
  });

  return (
    <>
      {!emailVerified && showBanner && <Banner action={toggleBanner} />}
      <div className={`flex h-screen ${emailVerified || !showBanner ? '' : 'pt-16'}`}>
        <div className="pt-4 w-[6em] h-full bg-gray-100 border-r border-gray-200 flex flex-col items-center">
          <Logo />
          <PrimaryNavigation />
        </div>
        <div className="flex-1 h-full bg-gray-100">
          <AccountBar />
          {children}
        </div>
      </div>
    </>
  );
}
