import {
  CarryOutOutlined,
  SmileOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, Flex } from 'antd';
import Sider, { SiderProps } from 'antd/es/layout/Sider';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import useIsModeratorOrAdmin from '../../hooks/useIsModeratorOrAdmin.ts';
import { useAppSelector } from '../../store';

const AppSider: FC<SiderProps> = props => {
  const navigate = useNavigate();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const isAdminOrModerator = useIsModeratorOrAdmin();

  if (isAuth)
    return (
      <Sider {...props}>
        <Flex vertical gap={10}>
          <Button
            icon={<CarryOutOutlined />}
            variant={'solid'}
            color={'primary'}
            size={'large'}
            style={{
              width: '100%',
            }}
            onClick={() => navigate('/')}
          >
            Список задач
          </Button>

          <Button
            icon={<SmileOutlined />}
            variant={'solid'}
            color={'primary'}
            size={'large'}
            style={{
              width: '100%',
            }}
            onClick={() => navigate('/profile')}
          >
            Профиль
          </Button>

          {isAdminOrModerator && (
            <Button
              icon={<UserSwitchOutlined />}
              variant={'solid'}
              color={'primary'}
              size={'large'}
              style={{
                width: '100%',
              }}
              onClick={() => navigate('/users')}
            >
              Пользователи
            </Button>
          )}
        </Flex>
      </Sider>
    );
};

export default AppSider;
