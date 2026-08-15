import React from 'react';
import type { TaskItem, TaskItemStatus } from '../types';

interface TaskListProps {
  tasks: TaskItem[];
  onUpdateStatus: (id: string, status: TaskItemStatus) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateStatus, onDeleteTask }) => {
  // Format Date to a readable form
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Check if date is today or in the past
  const isDueSoonOrPast = (dateStr: string, status: TaskItemStatus) => {
    if (status === 'Done') return false;
    try {
      const dueDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate <= today;
    } catch {
      return false;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '3rem' }}>📭</div>
        <h3 className="empty-state-title">No Tasks Found</h3>
        <p className="empty-state-description">
          Create a new task, adjust your search query, or clear your filters to find tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => {
        const isUrgent = isDueSoonOrPast(task.dueDate, task.status);
        
        return (
          <div key={task.id} className="task-card">
            {/* Header: Title and Priority */}
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-badges">
                <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {/* Meta data */}
            <div className="task-meta">
              <div className="meta-item">
                <span className="meta-label">Assignee:</span>
                <span className="meta-value">👤 {task.assignee}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Due Date:</span>
                <span className={`meta-value ${isUrgent ? 'due-soon' : ''}`}>
                  📅 {formatDate(task.dueDate)} {isUrgent && '⚠️'}
                </span>
              </div>
            </div>

            {/* Actions: Status dropdown and Delete */}
            <div className="task-actions">
              <select
                className="status-select"
                value={task.status}
                onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskItemStatus)}
              >
                <option value="Todo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <button
                type="button"
                className="btn-delete"
                onClick={() => onDeleteTask(task.id)}
                title="Delete task"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
