'use client';

import Navbar from '../../../elements/Navbar';
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Clock } from 'lucide-react';
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
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: '',
  });
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(`https://intern-assignment-backend.vercel.app/auth/fetchtasks/${user.id}`);
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
      const response = await fetch('https://intern-assignment-backend.vercel.app/auth/task', {
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
  
    try {
      const response = await fetch('https://intern-assignment-backend.vercel.app/auth/deletetodos', {
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
      const response = await fetch('https://intern-assignment-backend.vercel.app/auth/updatetask', {
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

  const filteredTasks = tasks
    .filter(task => {
      return (
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.dueDate || new Date(task.dueDate).toISOString().slice(0, 10) === filters.dueDate)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'priority') return a.priority.localeCompare(b.priority);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row w-full lg:w-[90%] mx-auto gap-8">
          <div className="task-background w-full lg:w-1/2 bg-cover bg-no-repeat p-8 text-center text-white font-semibold rounded-2xl relative overflow-hidden flex justify-center items-center mb-8 lg:mb-0 bg-black/30 backdrop-filter backdrop-blur-lg border border-blue-500/10 shadow-xl">
            <div className="relative z-10">
              <h2 className="task-title text-4xl lg:text-6xl text-left font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Effective Task Management
              </h2>
              <p className="task-description text-left text-lg text-gray-300">Prioritize and set deadlines for optimal results.</p>
            </div>
          </div>

          <div className="task-wrapper w-full lg:w-[45%] bg-black/30 backdrop-filter backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <h2 className="task-title text-3xl font-bold mb-6 text-white">Task Management</h2>

            <div className="mb-6 text-white">
              <h3 className="text-xl font-semibold">Welcome, {user?.name || 'User'}!</h3>
            </div>

            <form onSubmit={handleSubmit} className="task-form space-y-6">
              <div className="task-input">
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/50 text-white placeholder-gray-500 outline-none border border-blue-500/30 focus:border-blue-400 transition duration-300"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="task-input">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/50 text-white placeholder-gray-500 outline-none border border-blue-500/30 focus:border-blue-400 transition duration-300"
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>
              <div className="task-selects grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="task-select">
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="task-select">
                  <label className="block text-gray-300 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                {!isEditing && (
                  <button
                    type="submit"
                    className="task-submit w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-bold transform hover:scale-105 transition duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Add Task'}
                  </button>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="task-cancel w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-bold transform hover:scale-105 transition duration-300"
                  >
                    Update Task
                  </button>
                )}
              </div>

              {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>
          </div>
        </div>

        <div className="task-controls mt-8 flex flex-col md:flex-row gap-4">
          <select
            className="p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            className="p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
            onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
          />

          <select
            className="p-3 rounded-lg bg-black/50 text-white border border-blue-500/30 focus:border-blue-400 transition duration-300"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        <div className="task-list mt-8">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-item p-4 mb-4 bg-black/50 rounded-lg shadow-md text-white border border-blue-500/20 flex justify-between items-center">
              <div>
                <h3 className="task-title text-xl font-semibold mb-2">{task.title}</h3>
                <p className="task-description text-gray-300">{task.description}</p>
                <div className="task-meta mt-4 flex items-center space-x-4">
                  <span className="text-sm text-blue-300">
                    Status: {task.status}
                  </span>
                  <span className="text-sm text-yellow-300">
                    Priority: {task.priority}
                  </span>
                  <span className="text-sm text-red-300 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="task-actions flex items-center space-x-4">
                <button
                  className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => handleEdit(task)}
                >
                  <Edit2 className="h-5 w-5 text-white" />
                </button>
                <button
                  className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition duration-300"
                  onClick={() => handleDelete(task)}
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {loading && <p className="text-blue-300 mt-4">Loading...</p>}
      </div>
    </div>
  );
};



const Page = () => {
  return (
    <div className="bg-black min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-950 to-black">
      <div className="">
        <Navbar />
      </div>
      <div className="">
        <Task />
      </div>
    </div>
  );
};

export default Page;
