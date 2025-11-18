export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  priority: Priority;
  tags: string[];
  date: string; // YYYY-MM-DD format
}

export interface TodoFormData {
  title: string;
  description: string;
  time: string;
  location: string;
  priority: Priority;
  tags: string[];
}
