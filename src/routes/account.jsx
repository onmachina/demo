import AccountCard from '../components/AccountCard';

export default function AccountPage({ wallet, accountId }) {
  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <AccountCard wallet={wallet} accountId={accountId} />
    </div>
  );
}
