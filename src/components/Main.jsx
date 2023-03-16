import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useContext } from 'react';
import env from '../config/env';
import { HttpStatusEnum } from '../enums/httpStatusEnum';
import { TokenEnum } from '../enums/tokenEnum';
import { useOAuthClient } from '../providers/NmsItdOAuthProvider';
import AuthLanding from './AuthLanding';

const Main = ({ children }) => {
  const { oauth } = useOAuthClient();
  const logout = ({ status }) => {
    if(HttpStatusEnum.UNAUTHENTICATED === status) {
      const tokenId = localStorage.getItem(TokenEnum.TOKEN_ID);
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace(`${oauth?.oauthURL}/${env.API_VERSION_1}/oauth/logout-current-device?token_id=${tokenId}`);
    }
  };

  const {isLoading} = useQuery({
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
      { !isLoading && children }
    </Fragment> 
  );
}

export default Main;
