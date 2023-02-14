import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useContext } from 'react';
import { HttpStatusEnum } from '../enums/httpStatusEnum';
import { TokenEnum } from '../enums/tokenEnum';
import { useOAuthClient } from '../providers/NmsItdOAuthProvider';
import AuthLanding from './AuthLanding';

const Main = ({ children }) => {
  const { oauth } = useOAuthClient();
  const logout = ({ status }) => {
    if(HttpStatusEnum.UNAUTHENTICATED === status) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace('/');
    }
  };

  useQuery({
    queryKey: ['nmsitd-oauth-user'],
    queryFn: async () => {
      const response = await oauth.oauthUser();
      return oauth.handleOauthResponse(response);
    },
    enabled: Boolean(localStorage.getItem(TokenEnum.ACCESS_TOKEN)),
    onError: logout,
    onSuccess: (data) => data
  });

  return (
    <Fragment>
      <AuthLanding />
      { children }
    </Fragment> 
  );
}

export default Main;
