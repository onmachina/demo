import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { distinctUntilChanged, map } from "rxjs";
import * as nearAPI from 'near-api-js';

import { Loading } from "../components/Loading";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";

// todo: move to env
const CONTRACT_ID = "auth.onmachina.testnet";

const WalletSelectorContext =
  React.createContext(null);

export const WalletSelectorContextProvider = ({ children }) => {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [authKey, setAuthKey] = useState(null);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: "testnet",
      debug: true,
      modules: [
        setupMyNearWallet(),
        setupNearWallet(),
        setupWalletConnect({
          projectId: "c4f79cc...",
          metadata: {
            name: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            url: "https://github.com/near/wallet-selector",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        }),
      ],
    });
    const _modal = setupModal(_selector, {
      contractId: CONTRACT_ID,
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
  }, []);


  useEffect(() => {

    const fetchCredentials = async () => {

      const networkId = 'testnet';

      const config = {
        networkId,
        keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
      };

      const near = await nearAPI.connect(config);
      const signer = near.connection.signer;
      const signerPublicKey = (
        await signer.getPublicKey(accountId, config.networkId)
      ).toString();

      const account = new nearAPI.Account(near.connection, accountId);

      const nonce = (await account.getAccessKeys())
        .find((k) => k.public_key === signerPublicKey)
        .access_key.nonce.toString();

      const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce }));
      const signatureData = await signer.signMessage(
        accountData,
        accountId,
        networkId
      );

      const publicKey = Buffer.from(signatureData.publicKey.toString());
      const signature = Buffer.from(signatureData.signature);

      const credentials = Buffer.from(
        JSON.stringify({
          account: accountData.toString('base64'),
          publicKey: publicKey.toString('base64'),
          signature: signature.toString('base64'),
        })
      ).toString('base64');

      console.log('credentials',credentials);
      setAuthKey(credentials);
    }

    fetchCredentials();
  }, [accounts]);
  
  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);
      });

    const onHideSubscription = modal.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`);
    });

    return () => {
      subscription.unsubscribe();
      onHideSubscription.remove();
    };
  }, [selector]);

  if (!selector || !modal) {
    return <Loading />;
  }

  const accountId =
    accounts.find((account) => account.active)?.accountId || null;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
        authKey
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}