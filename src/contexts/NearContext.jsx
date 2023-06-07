import React, { useContext, useEffect, useState } from 'react';
import * as NearAccount from '../../lib/nearsetup';

export const NearAccountContext = React.createContext();

export const useNearAccountContext = () => useContext(NearAccountContext); // Updated export

export const NearAccountContextProvider = ({ children }) => {
  const [accountID, setAccountID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const loadAccountId = async () => {
    const accountId = await NearAccount.getAccountId();
    setAccountID(accountId);
  };

  const refreshAuthToken = async () => {
    console.log('checking token', authToken);
    if (authToken !== null) return;
    const token = await NearAccount.refreshAuthToken();
    console.log('setting token', token);
    setAuthToken(token);
  };

  useEffect(() => {
    loadAccountId();
    refreshAuthToken();
  }, []);

  return (
    <NearAccountContext.Provider value={{ loading, accountID, authToken }}>{children}</NearAccountContext.Provider>
  );
};
