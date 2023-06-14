import React, { useContext, useEffect, useState } from 'react';
import * as NearAccount from '../../lib/newnearsetup';

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

  const getAuthTokenFromAPI = async () => {
    console.log('requesting token from API');
    const authToken = await NearAccount.refreshAuthToken();
    setAuthToken(authToken);
    localStorage.setItem('authToken', authToken);
  };

  const refreshAuthToken = async () => {
    const authToken = await NearAccount.refreshAuthToken();
    setAuthToken(authToken);
    localStorage.setItem('authToken', authToken);
  };

  useEffect(() => {
    loadAccountId();
    // Check if the authToken exists in local storage
    const storedAuthToken = localStorage.getItem('authToken');

    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
    } else {
      getAuthTokenFromAPI();
    }
  }, []);

  return (
    <NearAccountContext.Provider value={{ loading, accountID, authToken }}>{children}</NearAccountContext.Provider>
  );
};
