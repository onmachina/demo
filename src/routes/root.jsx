import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { providers, utils } from "near-api-js";
import "@near-wallet-selector/modal-ui/styles.css";
import { useState, useEffect, useCallback, useContext } from "react";
import BN from "bn.js";

const getAccountBalance = async ({
    provider,
    accountId,
  }) => {
    try {
      const { amount } = await provider.query({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      });
      const bn = new BN(amount);
      return { hasBalance: !bn.isZero() };
    } catch {
      return { hasBalance: false };
    }
  };

export default function Root() {

    const { selector, modal, accounts, accountId } = useWalletSelector();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAccount = useCallback(async () => {
        if (!accountId) {
          return null;
        }
    
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    
        const { hasBalance } = await getAccountBalance({
          provider,
          accountId,
        });
    
        if (!hasBalance) {
          window.alert(
            `Account ID: ${accountId} has not been founded. Please send some NEAR into this account.`
          );
          const wallet = await selector.wallet();
          await wallet.signOut();
          return null;
        }
    
        return provider
          .query({
            request_type: "view_account",
            finality: "final",
            account_id: accountId,
          })
          .then((data) => ({
            ...data,
            account_id: accountId,
          }));
      }, [accountId, selector.options]);
    
    useEffect(() => {
        if (!accountId) {
            return setAccount(null);
        }

        setLoading(true);

        getAccount().then((nextAccount) => {
            setAccount(nextAccount);
            setLoading(false);
        });
    }, [accountId, getAccount]);

    const handleSignIn = () => {
        modal.show();
    };

    const handleSignOut = async () => {
        const wallet = await selector.wallet();

        wallet.signOut().catch((err) => {
            console.log("Failed to sign out");
            console.error(err);
        });
    };

    

    if (loading) {
        return null;
      }
    
    if (!account) {
    return (
            <div>
                <button onClick={handleSignIn}>Log in</button>
            </div>
        );
    }
    
    console.log("acconut", account);

    return (
            <div>
                <h1>OnMachina Demo</h1>

                <ul>
                    <li>
                        <a href="#" onClick={handleSignIn}>Sign In with your wallet</a>
                    </li>
                    <li>
                        <a href="#" onClick={handleSignOut}>Sign Out</a>
                    </li>
                </ul>
                
                <p>You are logged in as {account.account_id} with a balance of {account.amount}</p>
                
            </div>
    );
}