import { Todo } from '../types/todo';
import TodoCard from './TodoCard';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: () => void;
}

const TodoList = ({ todos, onEdit, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">這一天還沒有 Todo</p>
        <p className="text-xs text-gray-400 mt-1">點擊日期格中的「+」來新增</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
