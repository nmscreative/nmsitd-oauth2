import { create } from 'apisauce';
import { TokenEnum } from '../enums/tokenEnum';
import env from './env';

export const handleApiResponse = (response) => response.ok ? response.data : Promise.reject(response);

const api = create({
  baseURL: env.AUTH_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `Bearer ${localStorage.getItem(TokenEnum.ACCESS_TOKEN)}`
  },
});

export const fetchToken = (params) => api.post(`/api/${env.API_VERSION_1}/oauth/token`, params);
export const oauthPing = (params) => api.get(`/api/${env.API_VERSION_1}/oauth/ping`);
