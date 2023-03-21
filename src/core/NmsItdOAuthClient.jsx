import { create } from "apisauce";
import env from "../config/env";
import { TokenEnum } from "../enums/tokenEnum";
import OAuthUser from "./OAuthUser";

export default class NmsItdOAuthClient extends OAuthUser
{
  oauthClientId;
  oauthURL;
  oauthRedirectURI;
  api;
  ignoreRoutes = [];
  authUser;

  constructor(config = {})
  {
    super();
    this.oauthURL = config?.oauthURL || null;
    this.oauthClientId = config?.oauthClientId || null;
    this.oauthRedirectURI = config?.oauthRedirectURI || null;
    this.ignoreRoutes = config?.ignoreRoutes || [];
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
    ) throw ('Error OAuth Config: required.');

    if(!Array.isArray(this.ignoreRoutes)) throw 'ignoreRoutes must be an array.';
    return false
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  fetchToken(params)
  {
    return this.api.post(`/api/${env.API_VERSION_1}/oauth/token`, params);
  }

  fetchPlatformList()
  {
    return this.api.get(`/api/${env.API_VERSION_1}/client/oauth/platform-list`);
  }

  fetchAllowedPlatform()
  {
    return this.api.get(`/api/${env.API_VERSION_1}/client/oauth/user-platform-list/${this.userAccountId}/allowed`);
  }

  oauthUser()
  {
    return this.api.get(`/api/${env.API_VERSION_1}/oauth/auth-user`);
  }

  handleOauthResponse(response)
  {
    if (response.ok) {
      this.authUser = response.data;
      this.oauthUserData(response.data);
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