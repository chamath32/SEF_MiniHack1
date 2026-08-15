import { useEffect, useState } from 'react';
import type { TaskItem, TaskItemStatus, TaskPriority } from './types';
import { TaskSummary } from './components/TaskSummary';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';

const API_BASE_URL = 'http://localhost:5025/api/tasks';

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'add'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  // Fetch Tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      setError('Could not connect to the backend server. Please make sure the ASP.NET Core API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task to API
  const handleAddTask = async (taskData: {
    title: string;
    assignee: string;
    priority: TaskPriority;
    dueDate: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          assignee: taskData.assignee,
          priority: taskData.priority,
          dueDate: new Date(taskData.dueDate).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Extract validation errors
        let errorMsg = 'Failed to create task.';
        if (errorData.errors) {
          errorMsg = Object.values(errorData.errors).flat().join(' ');
        } else if (errorData.title || errorData.dueDate) {
          errorMsg = [...(errorData.title || []), ...(errorData.dueDate || [])].join(' ');
        }
        alert(`Validation Error: ${errorMsg}`);
        return false;
      }

      await fetchTasks(); // Reload tasks from DB
      setActiveTab('all'); // Go back to List tab
      return true;
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Error connecting to backend API.');
      return false;
    }
  };

  // Update Status in API
  const handleUpdateStatus = async (id: string, status: TaskItemStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      // Update state locally for instant responsiveness
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Error updating task status.');
    }
  };

  // Delete Task in API
  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task.');
      }

      // Remove state locally
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Error deleting task.');
    }
  };

  // Extract unique assignees for assignee filter dropdown
  const uniqueAssignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter((a) => a && a.trim() !== ''))
  );

  // Filter & Sort Tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'All' || task.assignee === assigneeFilter;
      return matchesSearch && matchesStatus && matchesAssignee;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by due date ascending

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Team Task Tracker</h1>
        <p className="app-subtitle">Track, filter, and manage your team's daily tasks in real-time.</p>

        {/* Tab Navigation */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📋 All Tasks
          </button>
          <button
            className={`nav-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Task
          </button>
        </div>
      </header>

      {error && (
        <div className="empty-state" style={{ borderColor: 'var(--danger)', borderStyle: 'solid' }}>
          <div style={{ fontSize: '3rem' }}>🔌</div>
          <h3 className="empty-state-title" style={{ color: 'var(--danger)' }}>Connection Error</h3>
          <p className="empty-state-description">{error}</p>
          <button className="form-submit-btn" style={{ maxWidth: '200px' }} onClick={fetchTasks}>
            🔄 Retry Connection
          </button>
        </div>
      )}

      {!error && (
        <>
          {/* Main Content Areas */}
          {activeTab === 'all' ? (
            <>
              {/* Summary dashboard */}
              <TaskSummary tasks={tasks} />

              {/* Filters Panel */}
              <TaskFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                assigneeFilter={assigneeFilter}
                setAssigneeFilter={setAssigneeFilter}
                assignees={uniqueAssignees}
              />

              {/* Task list view */}
              {loading ? (
                <div className="empty-state">
                  <div style={{ fontSize: '3rem' }}>⏳</div>
                  <h3 className="empty-state-title">Loading Tasks...</h3>
                  <p className="empty-state-description">Fetching current task lists from database.</p>
                </div>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </>
          ) : (
            <TaskForm onAddTask={handleAddTask} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
