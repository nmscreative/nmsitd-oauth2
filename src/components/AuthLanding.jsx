import React, { Fragment, useContext, useEffect, useState } from 'react';
import { CodeChallengeEnum } from '../enums/codeChallengeEnum';
import { TokenEnum } from '../enums/tokenEnum';
import pkce from '../helpers/pkce';
import { useOAuthClient } from '../providers/NmsItdOAuthProvider';

const AuthLanding = () => {
  const { oauth } = useOAuthClient();
  const [authState, setAuthState] = useState(null);

  const authProcess = async (authState) => {
    const accessToken = localStorage.getItem(TokenEnum.ACCESS_TOKEN);
    let tokenIsExpired = !accessToken;

    if(tokenIsExpired) {
      const result = await oauth.ping();
      tokenIsExpired = !result.ok;
    }

    if(tokenIsExpired) return pkce.PKCEAuthCodeFirstStep(oauth);
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
