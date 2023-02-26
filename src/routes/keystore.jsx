import * as nearAPI from 'near-api-js';
import { useState, useEffect } from 'react';
import { useWalletSelector } from '../contexts/WalletSelectorContext';

export default function KeyStore() {
  const { selector, modal, accounts, accountId } = useWalletSelector();

  useEffect(() => {
    // declare the async data fetching function
    const fetchAccount = async () => {
      const selectorWallet = await selector.wallet();
      const selectorAccount = (await selectorWallet.getAccounts()).shift(); // Get the 1st account
      const accountId = selectorAccount.accountId;
      const networkId = 'testnet';

      const config = {
        networkId,
        keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
      };

      const near = await nearAPI.connect(config);
      const signer = near.connection.signer;
      const signerPublicKey = (await signer.getPublicKey(accountId, config.networkId)).toString();

      const account = new nearAPI.Account(near.connection, accountId);

      const nonce = (await account.getAccessKeys())
        .find((k) => k.public_key === signerPublicKey)
        .access_key.nonce.toString();

      const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce }));
      const signatureData = await signer.signMessage(accountData, accountId, networkId);

      const publicKey = Buffer.from(signatureData.publicKey.toString());
      const signature = Buffer.from(signatureData.signature);

      const credentials = Buffer.from(
        JSON.stringify({
          account: accountData.toString('base64'),
          publicKey: publicKey.toString('base64'),
          signature: signature.toString('base64'),
        }),
      ).toString('base64');

      console.log(credentials);

      const response = await fetch('/api', {
        method: 'GET',
        headers: {
          'x-auth-user': 'any',
          'x-auth-key': credentials,
          'Access-Control-Allow-Origin': '*',
        },
      });

      const x_auth_token = response.headers.get('x-auth-token');
      console.log(x_auth_token);
    };

    // call the function
    fetchAccount().catch(console.error);
  }, []);

  return <div>My function</div>;
}
