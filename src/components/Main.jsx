import { useQuery } from '@tanstack/react-query';
import React, { Fragment } from 'react';
import { fetchAuthUser, handleApiResponse, oauthPing } from '../config/api';
import { HttpStatusEnum } from '../enums/httpStatusEnum';
import { TokenEnum } from '../enums/tokenEnum';
import AuthLanding from './AuthLanding';

const Main = ({ children }) => {
  const logout = (data) => {
    if(HttpStatusEnum.UNAUTHENTICATED === data.status) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace('/');
    }
  };

  useQuery({
    queryKey: ['oauth-ping'],
    queryFn: async () => {
      const response = await oauthPing();
      return handleApiResponse(response);
    },
    enabled: Boolean(localStorage.getItem(TokenEnum.ACCESS_TOKEN)),
    onError: logout,
    onSuccess: (data) => console.log(data?.message)
  });

  return (
    <Fragment>
      <AuthLanding />
      { children }
    </Fragment>
  );
}

export default Main;
