import {
  Button,
  Form,
  FormProps,
  Input,
  notification,
  Space,
  Spin,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  VALIDATION_INPUTS_MESSAGE,
  VALIDATION_INPUTS_RULES,
} from '../../constants/validationRules';
import getChangedFields from '../../helpers/getChangedFields';
import isEmptyObject from '../../helpers/isEmptyObject.ts';
import {
  getUserProfile,
  updateUserProfile,
} from '../../services/usersServices';
import { User, UserRequest } from '../../types/usersTypes';

type FieldType = {
  username?: string;
  email?: string;
  phoneNumber?: string;
};

const UserPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<User>({
    id: 0,
    username: '',
    email: '',
    date: '',
    isBlocked: false,
    roles: [],
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (id) {
        const response = await getUserProfile(+id);

        setUserProfile(response.data);

        form.setFieldsValue({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        });
      }
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при получении профиля пользователя',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userRequest: UserRequest): Promise<void> => {
    try {
      setIsLoading(true);
      if (id) {
        await updateUserProfile(+id, userRequest);
      }

      notification.success({
        title: 'Успех',
        description: 'Профиль обновлён',
      });
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при редактировании профиля пользователя',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit: FormProps<FieldType>['onFinish'] = async values => {
    const changedFields = getChangedFields(
      {
        username: userProfile.username,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
      },
      values,
    );

    if (!isEmptyObject(changedFields)) {
      await updateProfile(changedFields);
      await fetchUserProfile();
    }

    setIsDisabled(true);
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      name="profile"
      onFinish={handleFormSubmit}
      layout={'vertical'}
      disabled={isDisabled}
    >
      <Form.Item<FieldType>
        label="Имя пользователя:"
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

      <Form.Item<FieldType>
        label="Email пользователя:"
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
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Номер телефона:"
        name="phoneNumber"
        rules={[
          {
            pattern: VALIDATION_INPUTS_RULES.PHONE_NUMBER.REGEX,
            message: VALIDATION_INPUTS_MESSAGE.PHONE_NUMBER.REGEX,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Space>
        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="button"
            disabled={false}
            onClick={() => setIsDisabled(false)}
          >
            Редактировать
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="button"
            disabled={false}
            onClick={() => navigate('/users')}
          >
            Вернуться
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default UserPage;
