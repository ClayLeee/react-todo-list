import { useState, useEffect, useRef } from 'react';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import TodoModal from './components/TodoModal';
import TodoFormModal from './components/TodoFormModal';
import DateTodosPopup from './components/DateTodosPopup';
import { getTodosByDate } from './utils/storage';
import { parseDateString } from './utils/dateUtils';
import { Todo } from './types/todo';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [popupDate, setPopupDate] = useState<string>('');
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const todoListSectionRef = useRef<HTMLDivElement>(null);

  // Load todos when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const dateTodos = getTodosByDate(selectedDate);
      setTodos(dateTodos);
    }
  }, [selectedDate]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setEditingTodo(null);
    // Scroll to todo list section
    setTimeout(() => {
      todoListSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleAddTodoClick = (date: string) => {
    setSelectedDate(date);
    setEditingTodo(null);
    setIsSidebarOpen(true);
  };

  const handleShowMoreTodos = (date: string, position: { x: number; y: number }) => {
    setPopupDate(date);
    setPopupPosition(position);
    setIsPopupOpen(true);
  };

  const handleTodoClick = (todo: Todo) => {
    setViewingTodo(todo);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setViewingTodo(null);
    setIsSidebarOpen(true);
  };

  const handleFormModalClose = () => {
    setIsSidebarOpen(false);
    setEditingTodo(null);
  };

  const handleTodoSaved = () => {
    // Refresh todos after saving
    if (selectedDate) {
      const dateTodos = getTodosByDate(selectedDate);
      setTodos(dateTodos);
    }
  };

  const handleTodoDelete = () => {
    // Refresh todos after deleting
    if (selectedDate) {
      const dateTodos = getTodosByDate(selectedDate);
      setTodos(dateTodos);
    }
    setIsSidebarOpen(false);
    setEditingTodo(null);
    setViewingTodo(null);
  };

  const formatDate = (dateString: string): string => {
    const date = parseDateString(dateString);
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 md:py-8">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-6">
              <Calendar
                onDateClick={handleDateClick}
                onTodoClick={handleTodoClick}
                onAddTodoClick={handleAddTodoClick}
                onShowMoreTodos={handleShowMoreTodos}
              />
            </div>

            {/* Todo List Section */}
            <div className="lg:col-span-3" ref={todoListSectionRef}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {selectedDate ? formatDate(selectedDate) : '選擇日期'}
                  </h2>
                  {selectedDate && (
                    <button
                      onClick={() => handleAddTodoClick(selectedDate)}
                      className="p-2 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200 bg-blue-50"
                      title="新增 Todo"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
                {selectedDate ? (
                  <TodoList
                    todos={todos}
                    onEdit={handleEditTodo}
                    onDelete={handleTodoDelete}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">請點擊月曆上的日期來查看或新增 Todo</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Todo Form Modal */}
      <TodoFormModal
        isOpen={isSidebarOpen}
        onClose={handleFormModalClose}
        selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
        editingTodo={editingTodo}
        onTodoSaved={handleTodoSaved}
      />

      {/* Todo Modal */}
      <TodoModal
        todo={viewingTodo}
        isOpen={viewingTodo !== null}
        onClose={() => setViewingTodo(null)}
        onEdit={handleEditTodo}
        onDelete={handleTodoDelete}
      />

      {/* Date Todos Popup */}
      <DateTodosPopup
        date={popupDate}
        todos={popupDate ? getTodosByDate(popupDate) : []}
        isOpen={isPopupOpen}
        position={popupPosition}
        onClose={() => setIsPopupOpen(false)}
        onTodoClick={handleTodoClick}
        onAddTodo={() => {
          setSelectedDate(popupDate);
          setIsSidebarOpen(true);
        }}
      />
    </div>
  );
}

export default App;
