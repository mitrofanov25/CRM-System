import {
  Button,
  Flex,
  GetProp,
  Modal,
  notification,
  Popconfirm,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
} from 'antd';
import Input, { SearchProps } from 'antd/es/input';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router';

import {
  blockUser,
  deleteUser,
  getUsers,
  unblockUser,
  updateRightsUser,
} from '../../services/usersServices.ts';
import { Roles, User, UsersFilters } from '../../types/usersTypes.ts';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult['field'];
  sortOrder?: SorterResult['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  search?: string;
  isBlocked?: boolean;
}

interface ModalRoleOptions {
  idUser: number;
  rolesUser: Roles[];
}

const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalRoleOptions, setModalRoleOptions] = useState<ModalRoleOptions>({
    idUser: 0,
    rolesUser: [],
  });

  const columns: ColumnsType<User> = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      sorter: true,
    },
    {
      title: 'Email пользователя',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      render: (_, user) =>
        user.isBlocked ? (
          <Tag color={'red'}>ЗАБЛОКИРОВАН</Tag>
        ) : (
          <Tag color={'green'}>НЕ ЗАБЛОКИРОВАН</Tag>
        ),
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      render: (_, { roles }) => (
        <Flex gap="small" align="center" wrap>
          {roles.map(role => {
            let color = 'green';
            if (role === 'ADMIN') {
              color = 'pink';
            } else if (role === 'MODERATOR') {
              color = 'blue';
            }

            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (_, user) => (
        <Space>
          <Link to={`/user/${user.id}`}>
            <Button>Профиль</Button>
          </Link>
          <Popconfirm
            title="Удаление пользователя"
            description="Ты точно хочешь удалить этого пользователя?"
            onConfirm={() => handleDeleteUser(+user.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button>Удалить</Button>
          </Popconfirm>
          <Button onClick={() => showModal(+user.id, user.roles)}>
            Изменить роли
          </Button>
          {user.isBlocked ? (
            <Button
              style={{ width: 150 }}
              onClick={() => handleUnblockUser(+user.id)}
            >
              Разблокировать
            </Button>
          ) : (
            <Popconfirm
              title="Блокировка пользователя"
              description="Ты точно хочешь заблокировать этого пользователя?"
              onConfirm={() => handleBlockUser(+user.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button style={{ width: 150 }}>Заблокировать</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers({
      page: 0,
      limit: 20,
      isBlocked: tableParams.isBlocked,
    });
  }, []);

  const fetchUsers = async (usersFilters: UsersFilters) => {
    try {
      setIsLoading(true);

      const response = await getUsers(usersFilters);

      setUsers(response.data.data);
      setTableParams(prevState => ({
        ...prevState,
        pagination: {
          ...prevState.pagination,
          total: response.data.meta.totalAmount,
        },
      }));
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при получении пользователей',
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch: SearchProps['onSearch'] = value => {
    fetchUsers({ search: value });
  };

  const handleTableChange: TableProps<User>['onChange'] = (
    pagination,
    _,
    sorter,
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    fetchUsers({
      page: pagination?.current ? pagination?.current - 1 : 0,
      limit: pagination.pageSize,
      sortOrder:
        singleSorter.order === 'ascend'
          ? 'asc'
          : singleSorter.order === 'descend'
            ? 'desc'
            : undefined,
      sortBy: singleSorter?.field as string | undefined,
      isBlocked: tableParams.isBlocked,
    });

    setTableParams(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      sortOrder: singleSorter?.order,
      sortField: singleSorter?.field,
    }));
  };

  const handleBlockUser = async (id: number) => {
    try {
      await blockUser(id);

      const sortOrder =
        tableParams.sortOrder === 'ascend'
          ? 'asc'
          : tableParams.sortOrder === 'descend'
            ? 'desc'
            : undefined;

      await fetchUsers({
        page: tableParams?.pagination?.current
          ? tableParams?.pagination?.current - 1
          : 0,
        limit: tableParams?.pagination?.pageSize,
        sortOrder,
        sortBy: tableParams?.sortField as string | undefined,
        isBlocked: tableParams?.isBlocked,
      });
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при блокировке пользователя',
      });
    }
  };

  const handleUnblockUser = async (id: number) => {
    try {
      await unblockUser(id);

      const sortOrder =
        tableParams.sortOrder === 'ascend'
          ? 'asc'
          : tableParams.sortOrder === 'descend'
            ? 'desc'
            : undefined;

      await fetchUsers({
        page: tableParams?.pagination?.current
          ? tableParams?.pagination?.current - 1
          : 0,
        limit: tableParams?.pagination?.pageSize,
        sortOrder,
        sortBy: tableParams?.sortField as string | undefined,
        isBlocked: tableParams?.isBlocked,
      });
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при разблокировке пользователя',
      });
    }
  };

  const handleChangeStatusUser = (event: RadioChangeEvent) => {
    let statusFilter = event.target.value;

    statusFilter = statusFilter === 'all' ? undefined : statusFilter;

    const sortOrder =
      tableParams.sortOrder === 'ascend'
        ? 'asc'
        : tableParams.sortOrder === 'descend'
          ? 'desc'
          : undefined;

    fetchUsers({
      page: 0,
      limit: tableParams?.pagination?.pageSize,
      sortOrder,
      sortBy: tableParams?.sortField as string | undefined,
      isBlocked: statusFilter,
    });

    setTableParams(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        current: 1,
      },
      isBlocked: statusFilter,
    }));
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);

      const sortOrder =
        tableParams.sortOrder === 'ascend'
          ? 'asc'
          : tableParams.sortOrder === 'descend'
            ? 'desc'
            : undefined;

      await fetchUsers({
        page: tableParams?.pagination?.current
          ? tableParams?.pagination?.current - 1
          : 0,
        limit: tableParams?.pagination?.pageSize,
        sortOrder,
        sortBy: tableParams?.sortField as string | undefined,
        isBlocked: tableParams?.isBlocked,
      });
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при удалении пользователя',
      });
    }
  };

  const showModal = (id: number, roles: Roles[]) => {
    setIsModalOpen(true);

    setModalRoleOptions({ idUser: id, rolesUser: roles });
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeSelectRoles = (value: Roles[]) => {
    if (value.length < 1) return;

    setModalRoleOptions(prevState => ({
      ...prevState,
      rolesUser: value,
    }));
  };

  const handleChangeRolesUser = async () => {
    try {
      await updateRightsUser(
        modalRoleOptions.idUser,
        modalRoleOptions.rolesUser,
      );

      const sortOrder =
        tableParams.sortOrder === 'ascend'
          ? 'asc'
          : tableParams.sortOrder === 'descend'
            ? 'desc'
            : undefined;

      await fetchUsers({
        page: tableParams?.pagination?.current
          ? tableParams?.pagination?.current - 1
          : 0,
        limit: tableParams?.pagination?.pageSize,
        sortOrder,
        sortBy: tableParams?.sortField as string | undefined,
        isBlocked: tableParams?.isBlocked,
      });
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при редактировании ролей пользователя',
      });
    }

    handleCancelModal();
  };

  return (
    <>
      <Input.Search
        placeholder="Введите в поле поиска часть имени или email (например: ivan)."
        onSearch={onSearch}
        style={{ marginBottom: 20 }}
        size={'large'}
      />
      <Radio.Group
        block
        style={{ marginBlock: 20 }}
        options={[
          { label: 'Все пользователи', value: 'all' },
          { label: 'Только активные', value: false },
          { label: 'Только заблокированные', value: true },
        ]}
        defaultValue="all"
        onChange={handleChangeStatusUser}
      />
      <Table<User>
        columns={columns}
        rowKey={record => record.id}
        dataSource={users}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        bordered
        size={'small'}
      />
      <Modal
        title="Управление ролями пользователя"
        open={isModalOpen}
        onOk={handleChangeRolesUser}
        onCancel={handleCancelModal}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          onChange={handleChangeSelectRoles}
          value={modalRoleOptions.rolesUser}
          options={[
            { label: 'USER', value: 'USER' },
            { label: 'MODERATOR', value: 'MODERATOR' },
            { label: 'ADMIN', value: 'ADMIN' },
          ]}
        />
      </Modal>
    </>
  );
};

export default UsersPage;
