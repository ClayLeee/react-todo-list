import { useState, useEffect } from 'react';
import { Todo, TodoFormData, Priority } from '../types/todo';
import { addTodo, updateTodo, generateId } from '../utils/storage';
import { parseDateString } from '../utils/dateUtils';

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  editingTodo: Todo | null;
  onTodoSaved: () => void;
}

const TodoFormModal = ({ isOpen, onClose, selectedDate, editingTodo, onTodoSaved }: TodoFormModalProps) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    time: '',
    location: '',
    priority: 'medium',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description,
        time: editingTodo.time,
        location: editingTodo.location,
        priority: editingTodo.priority,
        tags: editingTodo.tags,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        time: '',
        location: '',
        priority: 'medium',
        tags: [],
      });
    }
    setTagInput('');
  }, [editingTodo, selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('請輸入標題');
      return;
    }

    if (editingTodo) {
      // Update existing todo
      updateTodo(editingTodo.id, {
        ...formData,
        date: selectedDate,
      });
    } else {
      // Create new todo
      addTodo({
        id: generateId(),
        ...formData,
        date: selectedDate,
      });
    }

    onTodoSaved();
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const formatDate = (dateString: string): string => {
    const date = parseDateString(dateString);
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  };

  if (!isOpen) return null;

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
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
            <h2 className="text-base font-semibold text-gray-700">
              {editingTodo ? '編輯 Todo' : '新增 Todo'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">日期</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(selectedDate)}</p>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                標題 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                placeholder="輸入標題"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                rows={3}
                placeholder="輸入描述"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  時間
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  地點
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="輸入地點"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                優先級
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`
                      flex-1 px-3 py-2 text-sm rounded-lg border transition-colors
                      ${formData.priority === priority
                        ? priority === 'low'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                          : priority === 'medium'
                          ? 'bg-amber-100 border-amber-400 text-amber-800'
                          : 'bg-red-100 border-red-400 text-red-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {priority === 'low' ? '低' : priority === 'medium' ? '中' : '高'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                標籤
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="輸入標籤後按 Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200"
                >
                  新增
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm text-gray-700 bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors text-sm border border-emerald-200"
              >
                {editingTodo ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TodoFormModal;
