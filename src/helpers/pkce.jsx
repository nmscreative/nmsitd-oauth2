import { generateChallenge } from 'pkce-challenge';
import env from '../config/env';
import { CodeChallengeEnum } from '../enums/codeChallengeEnum';
import { GrantTypeEnum } from '../enums/grantTypeEnum';
import { TokenEnum } from '../enums/tokenEnum';

const createCodeVerifier = ( size ) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~';
  const charsetIndexBuffer = new Uint8Array( size );

  for ( let i = 0; i < size; i += 1 ) {
    charsetIndexBuffer[i] = ( Math.random() * charset.length ) | 0;
  }

  let randomChars = [];
  for ( let i = 0; i < charsetIndexBuffer.byteLength; i += 1 ) {
    let index = charsetIndexBuffer[i] % charset.length;
    randomChars.push( charset[index] );
  }

  return randomChars.join('');
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const PKCEAuthCodeFirstStep = (oauth) => {
  const oauthURLAuthorize = `${oauth.oauthURL}/${env.API_VERSION_1}/oauth/authorize`;
  const queryParams = [`client_id=${oauth.oauthClientId}`];
  const codeVerifier = createCodeVerifier(getRandomInt(43, 128));
  const state = createCodeVerifier(40);
  sessionStorage.setItem( CodeChallengeEnum.CODE_VERIFIER, codeVerifier );
  sessionStorage.setItem( CodeChallengeEnum.STATE, state );
  try {
    const codeChallenge = generateChallenge(codeVerifier);
    queryParams.push(`redirect_uri=${oauth.oauthRedirectURI}`);
    queryParams.push('response_type=code');
    queryParams.push('scope=*');
    queryParams.push(`state=${state}`);
    queryParams.push(`code_challenge=${codeChallenge}`);
    queryParams.push('code_challenge_method=S256');
    window.location.replace(`${oauthURLAuthorize}?${queryParams.join('&')}`);
  } catch (error) {
    console.error('[error] PKCEAuthCodeFirstStep', error);
    sessionStorage.clear();
  }
};

const PKCEAuthCodeSecondStep = async (oauth, code) => {
  let params = {
    grant_type: GrantTypeEnum.AUTHORIZATION_CODE,
    redirect_uri: oauth.oauthRedirectURI,
    client_id: oauth.oauthClientId,
    code_verifier: sessionStorage.getItem(CodeChallengeEnum.CODE_VERIFIER),
    code: code
  };
  try {
    const result = await oauth.fetchToken(params);
    if (!result.ok) throw new Error('access token');
    const tokenResponse = result.data;
    sessionStorage.removeItem( CodeChallengeEnum.CODE_VERIFIER);
    localStorage.setItem(TokenEnum.TOKEN_TYPE, tokenResponse.token_type);
    localStorage.setItem(TokenEnum.EXPIRES_IN, tokenResponse.expires_in);
    localStorage.setItem(TokenEnum.ACCESS_TOKEN, tokenResponse.access_token);
    localStorage.setItem(TokenEnum.REFRESH_TOKEN, tokenResponse.refresh_token);
    localStorage.setItem(TokenEnum.TOKEN_ID, tokenResponse.token_id);
    window.location.replace(tokenResponse?.redirect_uri ?? '/');
  } catch (error) {
    console.error('[error] PKCEAuthCodeSecondStep', error);
    sessionStorage.clear();
  }
};

export default {
  PKCEAuthCodeFirstStep,
  PKCEAuthCodeSecondStep,
};
