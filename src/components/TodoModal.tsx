import { Todo, Priority } from '../types/todo';
import { deleteTodo } from '../utils/storage';

interface TodoModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: () => void;
}

const TodoModal = ({ todo, isOpen, onClose, onEdit, onDelete }: TodoModalProps) => {
  if (!todo || !isOpen) return null;

  const handleDelete = () => {
    if (window.confirm('確定要刪除這個 Todo 嗎？')) {
      deleteTodo(todo.id);
      onDelete();
      onClose();
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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{todo.title}</h2>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                {getPriorityText(todo.priority)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {todo.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">描述</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{todo.description}</p>
              </div>
            )}

            <div className="space-y-3">
              {todo.time && (
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">時間：</span>
                  <span className="ml-2">{todo.time}</span>
                </div>
              )}

              {todo.location && (
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">地點：</span>
                  <span className="ml-2">{todo.location}</span>
                </div>
              )}
            </div>

            {todo.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">標籤</h3>
                <div className="flex flex-wrap gap-2">
                  {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200"
                  >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
            <button
              onClick={() => {
                onEdit(todo);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
            >
              編輯
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoModal;
