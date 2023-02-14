import { create } from "apisauce";
import env from "../config/env";
import { TokenEnum } from "../enums/tokenEnum";

export default class NmsItdOAuthClient 
{
  oauthClientId;
  oauthURL;
  oauthRedirectURI;
  api;
  authUser;
  constructor(config = {})
  {
    this.oauthURL = config?.oauthURL || null;
    this.oauthClientId = config?.oauthClientId || null;
    this.oauthRedirectURI = config?.oauthRedirectURI || null;
    this.checkOAuthConfig();

    this.api = create({
      baseURL: this.oauthURL,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${localStorage.getItem(TokenEnum.ACCESS_TOKEN)}`
      },
    });
  }

  checkOAuthConfig()
  {
    if(
      this.isBlank(this.oauthURL) ||
      this.isBlank(this.oauthClientId) ||
      this.isBlank(this.oauthRedirectURI)
    ) throw new Error('Error OAuth Config: required.');
    return false
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  fetchToken(params)
  {
    return this.api.post(`/api/${env.API_VERSION_1}/oauth/token`, params);
  }

  oauthUser()
  {
    return this.api.get(`/api/${env.API_VERSION_1}/oauth/auth-user`);
  }

  handleOauthResponse(response)
  {
    if (response.ok) {
      this.authUser = response.data;
      return response.data;
    }
    return Promise.reject(response); 
  }

  handleApiResponse(response)
  {
    return response.ok ? response.data : Promise.reject(response); 
  }

  logout()
  {
    const tokenId = localStorage.getItem(TokenEnum.TOKEN_ID);
    let oauthLogoutCurrentDevice = `${this.oauthURL}/${env.API_VERSION_1}/oauth/logout-current-device`;
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace(`${oauthLogoutCurrentDevice}?token_id=${tokenId}`);
  }

  authUserData()
  {
    return this.authUser;
  }
}