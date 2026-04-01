import { Button, notification, Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { tokenManager } from '../../helpers/TokenManager.ts';
import { logout } from '../../services/authServices.ts';
import { getProfile } from '../../services/usersServices.ts';
import { useAppDispatch } from '../../store';
import { setAuth } from '../../store/slices/authSlice.ts';
import { ProfileRequest } from '../../types/authTypes.ts';

const ProfilePage: FC = () => {
  const [profile, setProfile] = useState<ProfileRequest>({
    username: '',
    email: '',
    phoneNumber: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await getProfile();

      setProfile({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
      });
    })();
  }, []);

  const dataSource = [
    {
      key: '1',
      username: profile.username,
      email: profile.email,
      phone: profile.phoneNumber || 'Не указан',
    },
  ];

  const columns = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Почтовый адрес',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setAuth(false));
      localStorage.clear();
      tokenManager.clearToken();
      navigate('/login');
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при обнулении токенов',
      });
    }
  };

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <Button
        style={{ marginLeft: '82%', marginTop: 8 }}
        size={'large'}
        onClick={handleLogout}
      >
        Выйти
      </Button>
    </>
  );
};

export default ProfilePage;
