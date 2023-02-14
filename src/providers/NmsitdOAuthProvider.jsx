import React from 'react';
import { createContext } from 'react';
import BaseProvider from './BaseProvider';

export const NmsitdOAuthContext = createContext(null);

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