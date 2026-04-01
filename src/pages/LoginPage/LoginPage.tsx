import { Button, Form, FormProps, Input, notification, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import {
  VALIDATION_INPUTS_MESSAGE,
  VALIDATION_INPUTS_RULES,
} from '../../constants/validationRules';
import { tokenManager } from '../../helpers/TokenManager';
import { login } from '../../services/authServices';
import { getProfile } from '../../services/usersServices';
import { useAppDispatch } from '../../store';
import { setAuth, setProfile } from '../../store/slices/authSlice';
import { AuthData } from '../../types/authTypes';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLoginSubmit: FormProps['onFinish'] = async (
    authData: AuthData,
  ): Promise<void> => {
    try {
      const response = await login(authData);

      localStorage.setItem('token', response.data.refreshToken);
      tokenManager.setToken(response.data.accessToken);

      dispatch(setAuth(true));

      await fetchProfile();

      navigate('/');
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Неверные логин или пароль',
        duration: 5,
      });
    }
  };

  const fetchProfile = async (): Promise<void> => {
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

  return (
    <Form
      name="basic"
      style={{ maxWidth: 420 }}
      onFinish={handleLoginSubmit}
      autoComplete="off"
      layout={'vertical'}
      size={'large'}
    >
      <Form.Item>
        <Typography.Title level={2}>Войти в свой аккаунт</Typography.Title>
      </Form.Item>

      <Form.Item
        label="Логин"
        name="login"
        rules={[
          {
            required: true,
            message: VALIDATION_INPUTS_MESSAGE.REQUIRED,
          },
          {
            min: VALIDATION_INPUTS_RULES.LOGIN.MIN_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.LOGIN.MIN_LENGTH,
          },
          {
            max: VALIDATION_INPUTS_RULES.LOGIN.MAX_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.LOGIN.MAX_LENGTH,
          },
          {
            pattern: VALIDATION_INPUTS_RULES.LOGIN.REGEX,
            message: VALIDATION_INPUTS_MESSAGE.LOGIN.REGEX,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[
          {
            required: true,
            message: VALIDATION_INPUTS_MESSAGE.REQUIRED,
          },
          {
            min: VALIDATION_INPUTS_RULES.PASSWORD.MIN_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.PASSWORD.MIN_LENGTH,
          },
          {
            max: VALIDATION_INPUTS_RULES.PASSWORD.MAX_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.PASSWORD.MAX_LENGTH,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>

      <Form.Item label={null}>
        <Link to={'/register'}>Зарегистрироваться</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
