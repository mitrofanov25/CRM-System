import { notification } from 'antd';
import axios from 'axios';

import { tokenManager } from '../helpers/TokenManager.ts';
import { Token } from '../types/authTypes.ts';

export const API_URL = 'https://easydev.club/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${tokenManager.getToken()}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;

      try {
        const response = await axios.post<Token>(`${API_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem('token'),
        });

        tokenManager.setToken(response.data.accessToken);

        prevRequest.headers.authorization = `Bearer ${tokenManager.getToken()}`;

        localStorage.setItem('token', response.data.refreshToken);

        return api(prevRequest);
      } catch {
        notification.error({
          title: 'Ошибка!',
          description: 'Срок действия токена истек',
        });
      }
    }
    return Promise.reject(error);
  },
);
