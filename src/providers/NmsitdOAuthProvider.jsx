import React, { Fragment, useContext } from 'react';
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

const NmsItdOAuthProvider = ({ children, oauth, developerMode = false }) => {
  const { pathname } = window.location;

  const isIgnoreRoute = () => {
    const ignoredRoutes = oauth.ignoreRoutes ?? [];
    return ignoredRoutes?.includes(pathname);
  }

  return (
    <NmsItdOAuthContext.Provider value={{ oauth }}>
      {
        (isIgnoreRoute() || Boolean(developerMode)) ? (
          <Fragment>
            {children}
          </Fragment>
        ) : (
          <BaseProvider>
            {children}
          </BaseProvider>
        )
      }
    </NmsItdOAuthContext.Provider>
  );
}

export default NmsItdOAuthProvider;