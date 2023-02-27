export default function AccountPage({ wallet, accountId }) {
  const handleSignOut = () => {
    wallet.signOut();
  };

  return (
    <div>
      <h2>Account Page</h2>
      <a href="#" onClick={handleSignOut}>
        Logout of {accountId}
      </a>
    </div>
  );
}
