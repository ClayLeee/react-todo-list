import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/todo';
import { parseDateString } from '../utils/dateUtils';

interface DateTodosPopupProps {
  date: string;
  todos: Todo[];
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onTodoClick: (todo: Todo) => void;
  onAddTodo: () => void;
}

const DateTodosPopup = ({
  date,
  todos,
  isOpen,
  position,
  onClose,
  onTodoClick,
  onAddTodo,
}: DateTodosPopupProps) => {
  const [adjustedPosition, setAdjustedPosition] = useState({ x: position.x, y: position.y });
  const [transformOrigin, setTransformOrigin] = useState('translateX(-50%)');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const cardElement = cardRef.current;

      // Use actual dimensions if available, otherwise use estimated dimensions
      const estimatedWidth = 320; // w-80 = 320px
      const estimatedHeight = 384; // max-h-96 = 384px

      let cardWidth = estimatedWidth;
      let cardHeight = estimatedHeight;

      if (cardElement) {
        const cardRect = cardElement.getBoundingClientRect();
        if (cardRect.width > 0) cardWidth = cardRect.width;
        if (cardRect.height > 0) cardHeight = cardRect.height;
      }

      const padding = 16; // Viewport edge padding
      const offsetY = 10; // Spacing below button

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate available space from button position
      const availableRight = viewportWidth - position.x;
      const availableLeft = position.x;
      const availableBottom = viewportHeight - position.y;
      const availableTop = position.y;

      let x = position.x;
      let y = position.y + offsetY;
      let transform = 'translateX(-50%)';

      // Horizontal positioning
      const halfWidth = cardWidth / 2;
      const minX = padding;
      const maxX = viewportWidth - padding;

      // Calculate ideal position (centered on button)
      let idealX = position.x;

      // Check if card fits when centered
      if (idealX - halfWidth >= minX && idealX + halfWidth <= maxX) {
        // Card fits perfectly centered
        x = idealX;
        transform = 'translateX(-50%)';
      } else {
        // Card doesn't fit centered, need to adjust
        // Try to fit by shifting left or right
        if (idealX - halfWidth < minX) {
          // Overflow on left, align to left edge
          x = minX;
          transform = 'translateX(0)';
        } else if (idealX + halfWidth > maxX) {
          // Overflow on right, try to align to right edge
          x = maxX;
          transform = 'translateX(-100%)';
        }

        // If card is still too wide, ensure it stays within bounds
        if (x + cardWidth > maxX) {
          x = maxX;
          transform = 'translateX(-100%)';
        }
        if (x < minX) {
          x = minX;
          transform = 'translateX(0)';
        }
      }

      // Vertical positioning
      // Check if there's enough space below
      const spaceBelow = availableBottom - offsetY;
      const spaceAbove = availableTop;

      if (spaceBelow >= cardHeight + padding) {
        // Enough space below, show below button
        y = position.y + offsetY;
      } else if (spaceAbove >= cardHeight + padding) {
        // Not enough space below, but enough above, show above button
        y = position.y - cardHeight - offsetY;
      } else {
        // Not enough space in either direction, choose the side with more space
        if (spaceBelow > spaceAbove) {
          // Show below, but adjust to fit
          y = viewportHeight - padding - cardHeight;
          if (y < padding) {
            y = padding;
          }
        } else {
          // Show above, but adjust to fit
          y = padding;
          if (y + cardHeight > viewportHeight - padding) {
            y = viewportHeight - padding - cardHeight;
            if (y < padding) {
              y = padding;
            }
          }
        }
      }

      setAdjustedPosition({ x, y });
      setTransformOrigin(transform);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      updatePosition();
      // Recalculate again after a short delay to get actual dimensions
      setTimeout(updatePosition, 0);
    });

    // Recalculate on window resize or scroll
    const handleResize = () => {
      requestAnimationFrame(updatePosition);
    };
    const handleScroll = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, position]);

  if (!isOpen) return null;

  const formatDate = (dateString: string): string => {
    const date = parseDateString(dateString);
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div
        ref={cardRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 overflow-hidden"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          transform: transformOrigin,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">{formatDate(date)}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Todo List */}
        <div className="overflow-y-auto max-h-64 p-2">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p>這一天還沒有 Todo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <button
                  key={todo.id}
                  onClick={() => {
                    onTodoClick(todo);
                    onClose();
                  }}
                  className={`
                    w-full text-left p-2 rounded border transition-colors
                    ${todo.priority === 'high'
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : todo.priority === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }
                  `}
                >
                  <div className="text-xs font-medium truncate">{todo.title}</div>
                  {todo.time && (
                    <div className="text-[10px] opacity-75 mt-0.5">{todo.time}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => {
              onAddTodo();
              onClose();
            }}
            className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
          >
            新增 Todo
          </button>
        </div>
      </div>
    </>
  );
};

export default DateTodosPopup;
