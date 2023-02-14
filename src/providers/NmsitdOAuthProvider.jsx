import React, { useContext } from 'react';
import { createContext } from 'react';
import BaseProvider from './BaseProvider';

const NmsItdOAuthContext = createContext(null);

export const useOAuthClient = () => {
  const oauthClient = useContext(NmsItdOAuthContext);
  if (!oauthClient) {
    throw new Error('No NmsItdOAuthClient set, use NmsItdOAuthProvider to set one')
  }

  return oauthClient;
};

const NmsItdOAuthProvider = ({ children, oauth }) => {
  return (
    <NmsItdOAuthContext.Provider value={{ oauth }}>
      <BaseProvider>
        {children}
      </BaseProvider>
    </NmsItdOAuthContext.Provider>
  );
}

export default NmsItdOAuthProvider;