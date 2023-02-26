import React from 'react';
import '@near-wallet-selector/modal-ui/styles.css';
import Layout from '../components/Layout';

export default function Root({ children }) {
  return (
    // <div>
    //     <h1>OnMachina Demo</h1>

    //     <ul>
    //         <li>
    //             <a href="#" onClick={handleSignIn}>Sign In with your wallet</a>
    //         </li>
    //         <li>
    //             <a href="#" onClick={handleSignOut}>Sign Out</a>
    //         </li>
    //     </ul>

    //     <p>You are logged in as {account.account_id} with a balance of {account.amount}</p>

    //     <Outlet />

    // </div>
    <Layout>{children}</Layout>
  );
}
