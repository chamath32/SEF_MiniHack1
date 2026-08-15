export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskItemStatus = 'Todo' | 'InProgress' | 'Done';

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskItemStatus;
  dueDate: string;
  createdAt: string;
}
