import React, { useState } from 'react';
import type { TaskPriority } from '../types';

interface TaskFormProps {
  onAddTask: (taskData: { title: string; assignee: string; priority: TaskPriority; dueDate: string }) => Promise<boolean>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  
  // Validation errors state
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Today's date formatted as YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors: { title?: string; dueDate?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      // Reset hours to compare dates only
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const success = await onAddTask({
      title: title.trim(),
      assignee: assignee.trim() || 'Unassigned',
      priority,
      dueDate,
    });
    
    setIsSubmitting(false);
    if (success) {
      setTitle('');
      setAssignee('');
      setPriority('Medium');
      setDueDate('');
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create New Task</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Title Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Task Title *
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
          />
          {errors.title && <span className="form-error">⚠️ {errors.title}</span>}
        </div>

        {/* Assignee Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="assignee">
            Assignee Name
          </label>
          <input
            id="assignee"
            type="text"
            className="form-input"
            placeholder="Who is working on this? (e.g. Alice)"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </div>

        {/* Priority Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Priority Level
          </label>
          <select
            id="priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="dueDate">
            Due Date *
          </label>
          <input
            id="dueDate"
            type="date"
            className="form-input"
            min={todayStr}
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
            }}
          />
          {errors.dueDate && <span className="form-error">⚠️ {errors.dueDate}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Task...' : '➕ Add Task'}
        </button>
      </form>
    </div>
  );
};
