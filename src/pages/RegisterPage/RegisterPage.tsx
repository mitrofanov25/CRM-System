import { Button, Form, FormProps, Input, notification, Typography } from 'antd';
import { FC, useState } from 'react';
import { Link } from 'react-router';

import {
  VALIDATION_INPUTS_MESSAGE,
  VALIDATION_INPUTS_RULES,
} from '../../constants/validationRules.ts';
import { register } from '../../services/authServices.ts';
import { UserRegistration } from '../../types/authTypes.ts';

const RegisterPage: FC = () => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const onFinish: FormProps['onFinish'] = async (
    userRegistration: UserRegistration,
  ) => {
    try {
      await register(userRegistration);

      setIsRegistered(true);
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Такой логин уже существует',
      });
    }
  };

  if (isRegistered) {
    return (
      <>
        <Typography.Title level={2}>
          Регистрация прошла успешно!
        </Typography.Title>
        <Link to={'/login'}>Войти в систему</Link>
      </>
    );
  }

  return (
    <Form
      name="basic"
      style={{ maxWidth: 420 }}
      onFinish={onFinish}
      autoComplete="off"
      layout={'vertical'}
      size={'large'}
    >
      <Form.Item>
        <Typography.Title level={2}>Регистрация</Typography.Title>
      </Form.Item>

      <Form.Item
        label="Имя пользователя"
        name="username"
        rules={[
          {
            required: true,
            message: VALIDATION_INPUTS_MESSAGE.REQUIRED,
          },
          {
            min: VALIDATION_INPUTS_RULES.USERNAME.MIN_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.USERNAME.MIN_LENGTH,
          },
          {
            max: VALIDATION_INPUTS_RULES.USERNAME.MAX_LENGTH,
            message: VALIDATION_INPUTS_MESSAGE.USERNAME.MAX_LENGTH,
          },
          {
            pattern: VALIDATION_INPUTS_RULES.USERNAME.REGEX,
            message: VALIDATION_INPUTS_MESSAGE.USERNAME.REGEX,
          },
        ]}
      >
        <Input />
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

      <Form.Item
        label="Повторите пароль"
        name="confirmPassword"
        dependencies={['password']}
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
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('Новый пароль, который вы ввели, не совпадает!'),
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Почтовый адрес"
        name="email"
        rules={[
          {
            required: true,
            message: VALIDATION_INPUTS_MESSAGE.REQUIRED,
          },
          {
            pattern: VALIDATION_INPUTS_RULES.EMAIL.REGEX,
            message: VALIDATION_INPUTS_MESSAGE.EMAIL.REGEX,
          },
        ]}
      >
        <Input type={'email'} />
      </Form.Item>

      <Form.Item
        label="Телефон"
        name="phoneNumber"
        rules={[
          {
            pattern: VALIDATION_INPUTS_RULES.PHONE_NUMBER.REGEX,
            message: VALIDATION_INPUTS_MESSAGE.PHONE_NUMBER.REGEX,
          },
        ]}
      >
        <Input type={'tel'} />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>

      <Form.Item label={null}>
        <Link to={'/login'}>Войти</Link>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
