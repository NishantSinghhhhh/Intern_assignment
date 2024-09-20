'use client';
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const Task = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    id: null,
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Low',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(`http://localhost:8000/auth/fetchtasks/${user.id}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'An unexpected error occurred');
        }

        setTasks(result.tasks);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [user]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.title.trim() === '') return;

    setLoading(true);
    setErrorMessage(null);

    if (!user || !user.id) {
      setErrorMessage('User ID is required to add a task.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }

      if (isEditing) {
        setTasks(tasks.map(t => (t.id === task.id ? { ...t, ...task } : t)));
      } else {
        setTasks([...tasks, { ...task, id: Date.now().toString() }]);
      }

      setTask({ id: null, title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (task) => {
    setLoading(true);
    setErrorMessage(null);
  
    console.log('Task data to be deleted:', task);
  
    try {
      const response = await fetch('http://localhost:8000/auth/deletetodos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }
  
      setTasks(tasks.filter(t => t.id !== task.id)); 
      setTask({ id: null, title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (taskToEdit) => {
    setTask(taskToEdit);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrorMessage(null);
  
    try {
      const response = await fetch('http://localhost:8000/auth/updatetask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, userId: user.id }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }
  
      setTasks(tasks.map(t => (t.title === task.title ? { ...t, ...task } : t)));
      setTask({ id: null, title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row w-full lg:w-[80%] mx-auto">
        <div className="task-background w-full lg:w-1/2 bg-cover bg-no-repeat p-8 text-center text-white font-semibold text-lg shadow-lg rounded-lg relative overflow-hidden flex justify-center items-center mb-8 lg:mb-0">
          <div className="relative z-10">
            <h2 className="task-title text-4xl lg:text-7xl text-left font-bold mb-4">Effective Task Management</h2>
            <p className="task-description text-left text-lg">Prioritize and set deadlines for optimal results.</p>
          </div>
        </div>

        <div className="task-wrapper w-full lg:w-[40%] bg-gray-800/40 backdrop-blur-lg rounded-lg p-6 shadow-lg lg:ml-8">
          <h2 className="task-title text-3xl font-bold mb-6 text-white">Task Management</h2>

          <div className="mb-6 text-white">
            <h3 className="text-xl font-semibold">Welcome, {user?.name || 'User'}!</h3>
          </div>

          <form onSubmit={handleSubmit} className="task-form space-y-4">
            <div className="task-input">
              <label className="block text-white">Title</label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 outline-none"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="task-input">
              <label className="block text-white">Description</label>
              <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 outline-none"
                placeholder="Enter task description"
              />
            </div>
            <div className="task-selects grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="task-select">
                <label className="block text-white">Status</label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-900 text-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="task-select">
                <label className="block text-white">Priority</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-900 text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="task-input">
              <label className="block text-white">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-900 text-white outline-none"
              />
            </div>
            <div className="flex justify-between">
              {!isEditing && (
                <button
                  type="submit"
                  className="task-submit w-full p-3 bg-green-600 rounded-lg text-white font-bold mr-2"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add Task'}
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="task-cancel w-full p-3 bg-green-600 rounded-lg text-white font-bold"
                >
                  Update Task
                </button>
              )}
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </form>
        </div>
      </div>
      <div className="task-list mt-6 w-full lg:w-[80%] mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-4">Task List</h3>
        {tasks.length === 0 ? (
          <p className="text-white">No tasks available</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="task-item bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg border border-gray-700 shadow-lg" 
                onClick={() => console.log(task)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white mb-2 sm:mb-0">{task.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{task.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-400">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      task.status === 'Completed' ? 'bg-green-500' :
                      task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span>{task.status}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'No due date'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <AlertTriangle size={16} className="mr-1" />
                    <span>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;