import { Layout, notification } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState, type FC } from 'react';

import TodoList from '../../components/TodoList';
import TodoStatusFilter from '../../components/TodoStatusFilter';
import TodoTitle from '../../components/TodoTitle';
import { getTodos } from '../../services/todoServices.ts';
import { Todo, TodoInfoFilter } from '../../types/todoTypes.ts';

const TodoPage: FC = () => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [todoInfoStatuses, setTodoInfoStatuses] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  });
  const [activeInfoStatus, setActiveInfoStatus] =
    useState<TodoInfoFilter>('all');

  useEffect(() => {
    updateTodo();

    const refreshInterval = setInterval(updateTodo, 5000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [activeInfoStatus]);

  const updateTodo = async () => {
    try {
      const response = await getTodos(activeInfoStatus);

      setTodoItems(response.data.data);

      if (response.data.info) {
        setTodoInfoStatuses(response.data.info);
      }
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при загрузке списка задач',
      });
    }
  };

  return (
    <Layout>
      <Content>
        <TodoTitle updateTodo={updateTodo} />
        <TodoStatusFilter
          todoInfoStatuses={todoInfoStatuses}
          setActiveInfoStatus={setActiveInfoStatus}
        />
        <TodoList todoItems={todoItems} updateTodo={updateTodo} />
      </Content>
    </Layout>
  );
};

export default TodoPage;
