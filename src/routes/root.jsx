import React from 'react';
import '@near-wallet-selector/modal-ui/styles.css';
import Layout from '../components/Layout';

export default function Root({ wallet, accountId, children }) {
  return (
    <Layout wallet={wallet} accountId={accountId}>
      {children}
    </Layout>
  );
}
