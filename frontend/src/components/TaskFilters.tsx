import React from 'react';

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (assignee: string) => void;
  assignees: string[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  assignees,
}) => {
  return (
    <div className="controls-panel">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters Group */}
      <div className="filter-group">
        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Todo">To Do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {/* Assignee Filter */}
        <select
          className="filter-select"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
        >
          <option value="All">All Assignees</option>
          {assignees.filter(a => a && a.trim() !== '').map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
