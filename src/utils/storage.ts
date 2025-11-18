import { Todo } from '../types/todo';

const STORAGE_KEY = 'todo-list-calendar';

// Get all todos from localStorage
export const getTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading todos from localStorage:', error);
    return [];
  }
};

// Save todos to localStorage
export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Add a new todo
export const addTodo = (todo: Todo): void => {
  const todos = getTodos();
  todos.push(todo);
  saveTodos(todos);
};

// Update an existing todo
export const updateTodo = (id: string, updatedTodo: Partial<Todo>): void => {
  const todos = getTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...updatedTodo };
    saveTodos(todos);
  }
};

// Delete a todo
export const deleteTodo = (id: string): void => {
  const todos = getTodos();
  const filteredTodos = todos.filter(todo => todo.id !== id);
  saveTodos(filteredTodos);
};

// Get todos for a specific date
export const getTodosByDate = (date: string): Todo[] => {
  const todos = getTodos();
  return todos.filter(todo => todo.date === date);
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
