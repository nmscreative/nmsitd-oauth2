import React, { useContext } from 'react';
import { createContext } from 'react';
import BaseProvider from './BaseProvider';

const NmsitdOAuthContext = createContext(null);

export const useOAuthClient = () => {
  const oauthClient = useContext(NmsitdOAuthContext);
  if (!oauthClient) {
    throw new Error('No NmsItdOAuthClient set, use NmsitdOAuthProvider to set one')
  }

  return oauthClient;
};

const NmsitdOAuthProvider = ({ children, oauth }) => {
  return (
    <NmsitdOAuthContext.Provider value={{ oauth }}>
      <BaseProvider>
        {children}
      </BaseProvider>
    </NmsitdOAuthContext.Provider>
  );
}

export default NmsitdOAuthProvider;