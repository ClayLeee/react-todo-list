import { useState } from 'react';
import { getTodosByDate } from '../utils/storage';
import { formatDateToString, parseDateString } from '../utils/dateUtils';
import { Todo } from '../types/todo';

interface CalendarProps {
  onDateClick: (date: string) => void;
  onTodoClick: (todo: Todo) => void;
  onAddTodoClick: (date: string) => void;
  onShowMoreTodos?: (date: string, position: { x: number; y: number }) => void;
}

const Calendar = ({ onDateClick, onTodoClick, onAddTodoClick, onShowMoreTodos }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();
  const todayString = formatDateToString(today.getFullYear(), today.getMonth(), today.getDate());

  // Get year range (this year + next 2 years)
  const minYear = today.getFullYear();
  const maxYear = today.getFullYear() + 2;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrevYear = () => {
    if (currentYear > minYear) {
      setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
    }
  };

  const handleNextYear = () => {
    if (currentYear < maxYear) {
      setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
    }
  };

  const handleDateClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateString = formatDateToString(currentYear, currentMonth, day);
    onDateClick(dateString);
  };

  const handleAddTodoClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateString = formatDateToString(currentYear, currentMonth, day);
    onAddTodoClick(dateString);
  };

  const handleTodoClick = (todo: Todo, e: React.MouseEvent) => {
    e.stopPropagation();
    onTodoClick(todo);
  };

  const getTodosForDate = (day: number): Todo[] => {
    const dateString = formatDateToString(currentYear, currentMonth, day);
    return getTodosByDate(dateString);
  };

  const isToday = (day: number): boolean => {
    const dateString = formatDateToString(currentYear, currentMonth, day);
    return dateString === todayString;
  };

  const isPastDate = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today && !isToday(day);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header with year and month navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevYear}
            disabled={currentYear <= minYear}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium min-w-[80px] text-center text-gray-700">
            {currentYear} 年
          </span>
          <button
            onClick={handleNextYear}
            disabled={currentYear >= maxYear}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium min-w-[100px] text-center text-gray-700">
            {monthNames[currentMonth]}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2 text-sm">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const todos = getTodosForDate(day);
          const todosCount = todos.length;
          const isTodayDate = isToday(day);
          const isPast = isPastDate(day);
          const displayTodos = todos.slice(0, 2); // Show max 2 todos
          const remainingCount = todosCount - 2;

          return (
            <div
              key={day}
              className={`
                min-h-[120px] rounded-lg border transition-all cursor-pointer
                ${isTodayDate
                  ? 'bg-gray-50 border-gray-400'
                  : isPast
                  ? 'bg-gray-50 text-gray-400 border-gray-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }
                flex flex-col p-1.5 relative
              `}
              onClick={(e) => {
                if (!isPast) {
                  const dateString = formatDateToString(currentYear, currentMonth, day);
                  onDateClick(dateString);
                }
              }}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                <span className={`text-xs font-medium ${isTodayDate ? 'text-gray-900 font-semibold' : isPast ? 'text-gray-400' : 'text-gray-700'}`}>
                  {day}
                </span>
                {isTodayDate && (
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                )}
              </div>

              {/* Todo list */}
              <div className="flex-1 min-h-0 space-y-1 overflow-y-auto">
                {displayTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={(e) => handleTodoClick(todo, e)}
                    className={`
                      w-full text-left px-1.5 py-1 rounded text-[10px] leading-tight
                      transition-colors hover:bg-opacity-90 block flex-shrink-0
                      ${todo.priority === 'high'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : todo.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }
                    `}
                    title={todo.title}
                  >
                    <span className="line-clamp-2 block">{todo.title}</span>
                  </button>
                ))}
                {remainingCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const dateString = formatDateToString(currentYear, currentMonth, day);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const position = {
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      };
                      if (onShowMoreTodos) {
                        onShowMoreTodos(dateString, position);
                      }
                    }}
                    className="px-1.5 py-1 text-[10px] text-blue-600 font-medium hover:text-blue-800 hover:bg-blue-50 rounded transition-colors w-full text-left border border-blue-200 bg-blue-50 flex-shrink-0"
                  >
                    +{remainingCount} 更多
                  </button>
                )}
              </div>

              {/* Add button */}
              <button
                onClick={(e) => handleAddTodoClick(day, e)}
                className={`
                  mt-1.5 flex-shrink-0 w-full py-1 rounded text-[10px] font-medium transition-colors
                  ${isPast
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }
                `}
                disabled={isPast}
              >
                {todosCount === 0 ? '+' : '新增'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
