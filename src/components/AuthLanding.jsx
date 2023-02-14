import React, { Fragment, useContext, useEffect, useState } from 'react';
import { CodeChallengeEnum } from '../enums/codeChallengeEnum';
import { TokenEnum } from '../enums/tokenEnum';
import pkce from '../helpers/pkce';
import { useOAuthClient } from '../providers/NmsitdOAuthProvider';

const AuthLanding = () => {
  const { oauth } = useOAuthClient();
  const [authState, setAuthState] = useState(null);

  const authProcess = async (authState) => {
    const accessToken = localStorage.getItem(TokenEnum.ACCESS_TOKEN);
    if(!sessionStorage.getItem(CodeChallengeEnum.CODE_VERIFIER) && !accessToken) return pkce.PKCEAuthCodeFirstStep(oauth);
    if(authState?.authCode && !accessToken) return await pkce.PKCEAuthCodeSecondStep(oauth, authState?.authCode);
  }

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const newAuthState = {
      authCode: params.get(CodeChallengeEnum.CODE),
    };
    setAuthState(newAuthState);
  }, []);

  useEffect(() => {
    authProcess(authState);
  }, [authState]);

  return (
    <Fragment />
  );
}

export default AuthLanding;
