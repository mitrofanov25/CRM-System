import { Flex, Layout, notification } from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { API_URL } from './api/http';
import loginImage from './assets/image/auth_illustration.png';
import AppRoutes from './components/AppRoutes';
import AppSider from './components/AppSider';
import { tokenManager } from './helpers/TokenManager';
import { getProfile } from './services/usersServices';
import { useAppDispatch, useAppSelector } from './store';
import { setAuth, setProfile } from './store/slices/authSlice';
import { Token } from './types/authTypes';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('token'));

  const refresh = async (token: string) => {
    const response = await axios.post<Token>(`${API_URL}/auth/refresh`, {
      refreshToken: token,
    });

    tokenManager.setToken(response.data.accessToken);

    dispatch(setAuth(true));

    localStorage.setItem('token', response.data.refreshToken);
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      dispatch(setProfile(response.data));
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при получении профиля',
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    (async () => {
      if (token) {
        setIsLoading(true);
        try {
          await refresh(token);
          await fetchProfile();
        } catch {
          localStorage.clear();
          tokenManager.clearToken();
        }
      } else {
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Layout>
      <AppSider theme={'light'} />
      <Flex align={'center'} justify={'center'}>
        {!isAuth && <img width={1000} height={1000} src={loginImage} alt="" />}
        <Content>
          <AppRoutes />
        </Content>
      </Flex>
    </Layout>
  );
}

export default App;
