import { Todo, Priority } from '../types/todo';
import { deleteTodo } from '../utils/storage';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: () => void;
}

const TodoCard = ({ todo, onEdit, onDelete }: TodoCardProps) => {
  const handleDelete = () => {
    if (window.confirm('確定要刪除這個 Todo 嗎？')) {
      deleteTodo(todo.id);
      onDelete();
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityText = (priority: Priority): string => {
    switch (priority) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow p-4 border border-gray-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800 flex-1 line-clamp-2">{todo.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium border flex-shrink-0 ml-2 ${getPriorityColor(todo.priority)}`}>
          {getPriorityText(todo.priority)}
        </span>
      </div>

      {todo.description && (
        <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
      )}

      <div className="space-y-2 mb-3">
        {todo.time && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {todo.time}
          </div>
        )}

        {todo.location && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {todo.location}
          </div>
        )}
      </div>

      {todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {todo.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(todo)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
        >
          編輯
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
        >
          刪除
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
