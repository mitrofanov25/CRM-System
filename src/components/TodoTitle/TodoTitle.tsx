import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  notification,
  Space,
} from 'antd';
import { FC } from 'react';

import {
  VALIDATION_INPUTS_MESSAGE,
  VALIDATION_INPUTS_RULES,
} from '../../constants/validationRules.ts';
import { addTodo } from '../../services/todoServices.ts';
import { Todo } from '../../types/todoTypes.ts';

type TodoTitleProps = {
  updateTodo: () => Promise<void>;
};

const TodoTitle: FC<TodoTitleProps> = props => {
  const { updateTodo } = props;

  const onFinish: FormProps['onFinish'] = async (
    values: Pick<Todo, 'title'>,
  ) => {
    try {
      await addTodo(values.title);
      await updateTodo();
    } catch {
      notification.error({
        title: 'Ошибка!',
        description: 'Ошибка при добавлении задачи',
      });
    }
  };

  return (
    <Flex justify={'center'}>
      <Form onFinish={onFinish} autoComplete="off">
        <Space.Compact>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: VALIDATION_INPUTS_MESSAGE.REQUIRED },
              { whitespace: true, message: VALIDATION_INPUTS_MESSAGE.REQUIRED },
              {
                min: VALIDATION_INPUTS_RULES.TITLE.MIN_LENGTH,
                message: VALIDATION_INPUTS_MESSAGE.TITLE.MIN_LENGTH,
              },
              {
                max: VALIDATION_INPUTS_RULES.TITLE.MAX_LENGTH,
                message: VALIDATION_INPUTS_MESSAGE.TITLE.MAX_LENGTH,
              },
            ]}
          >
            <Input
              placeholder={'Задача, которую нужно выполнить...'}
              variant={'outlined'}
              size={'large'}
              style={{ width: 500 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size={'large'}>
              Добавить
            </Button>
          </Form.Item>
        </Space.Compact>
      </Form>
    </Flex>
  );
};

export default TodoTitle;
