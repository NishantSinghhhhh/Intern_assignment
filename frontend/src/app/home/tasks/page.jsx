'use client';
import React, { useState } from 'react';
import Navbar from '../../../elements/Navbar';
import { Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { useUser } from '@/context/UserContext'; // Import useUser hook

const Task = () => {
  const { user } = useUser(); // Get user details from context
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    id: null,
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Low',
    dueDate: '',
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title.trim() === '') return;

    if (task.id) {
      // Editing an existing task
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      // Adding a new task
      setTasks([...tasks, { ...task, id: Date.now().toString() }]);
    }
    
    // Reset form
    setTask({ id: null, title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
  };

  const handleEdit = (taskToEdit) => {
    setTask(taskToEdit);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <>
      {/* Background image or color on the left */}
      <div className='flex w-[80%] mx-auto'>
        <div
          className="task-background w-1/2 bg-cover bg-no-repeat p-8 text-center text-white font-semibold text-lg shadow-lg rounded-lg relative overflow-hidden flex justify-center items-center"
        >
          <div className="relative z-10">
            <h2 className="task-title text-7xl text-left font-bold mb-4">Effective Task Management</h2>
            <p className="task-description text-left text-lg">Prioritize and set deadlines for optimal results.</p>
          </div>
        </div>

        {/* Task form and list on the right */}
        <div className="task-wrapper mr-[20px] w-[40%] h-[65%] bg-gray-800/40 backdrop-blur-lg rounded-lg p-6 shadow-lg">
          <h2 className="task-title text-3xl font-bold mb-6 text-white">Task Management</h2>

          {/* Display user details */}
          <div className="mb-6 text-white">
            <h3 className="text-xl font-semibold">Welcome, {user?.name || 'User'}!</h3>
            <p className="text-gray-300">Your email: {user?.email || 'Not available'}</p>
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
            <div className="task-selects grid grid-cols-2 gap-4">
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
            <button type="submit" className="task-submit w-full p-3 bg-green-600 rounded-lg text-white font-bold">
              {task.id ? 'Update Task' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>
      <div className="task-list mt-6 w-[80%] mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-4">Task List</h3>
        {tasks.length === 0 ? (
          <p className="text-white">No tasks available</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="task-item bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg border border-gray-700 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white">{task.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
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
                      task.status === 'Completed' ? 'bg-green-400' :
                      task.status === 'In Progress' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    <span>{task.status}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <AlertTriangle size={16} className="mr-2" />
                    <span>{task.priority}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock size={16} className="mr-2" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const Page = () => {
  return (
    <div className="bg-black min-h-screen w-full">
      <div className="mt-6">
        <Navbar />
      </div>
      <div className="mt-8 mb-[5%]">
        <Task />
      </div>
    </div>
  );
};

export default Page;
