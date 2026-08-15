import React from 'react';
import type { TaskItem } from '../types';

interface TaskSummaryProps {
  tasks: TaskItem[];
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'Todo').length;
  const inProgress = tasks.filter(t => t.status === 'InProgress').length;
  const done = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="summary-container">
      <div className="summary-card total">
        <span className="summary-label">Total Tasks</span>
        <span className="summary-value">{total}</span>
      </div>
      <div className="summary-card todo">
        <span className="summary-label">To Do</span>
        <span className="summary-value">{todo}</span>
      </div>
      <div className="summary-card progress">
        <span className="summary-label">In Progress</span>
        <span className="summary-value">{inProgress}</span>
      </div>
      <div className="summary-card done">
        <span className="summary-label">Completed</span>
        <span className="summary-value">{done}</span>
      </div>
    </div>
  );
};
