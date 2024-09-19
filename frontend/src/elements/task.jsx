'use client'

import React, { useState } from 'react';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
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
    setTasks([...tasks, task]);
    setTask({ title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="task-container flex h-screen">
      {/* Background image or color on the left */}
      <div
        className="task-background w-1/2 bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('https://picsum.photos/id/237/200/300')" }}
      >
      </div>

      {/* Task form and list on the right */}
      <div className="task-wrapper w-1/2 bg-gray-800/40 backdrop-blur-lg rounded-lg p-6 shadow-lg">
        <h2 className="task-title text-3xl font-bold mb-6 text-white">Task Management</h2>

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
            Add Task
          </button>
        </form>

        {/* Display tasks */}
        <div className="task-list mt-8">
          <h3 className="text-2xl font-bold text-white">Tasks</h3>
          <ul className="space-y-4 mt-4">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="task-item p-4 bg-gray-700 rounded-lg flex justify-between items-center text-white shadow-md"
              >
                <div>
                  <h4 className="text-lg font-bold">{task.title}</h4>
                  <p className="text-gray-300">{task.description}</p>
                  <p className="text-gray-300">Status: {task.status}</p>
                  <p className="text-gray-300">Priority: {task.priority}</p>
                  {task.dueDate && <p className="text-gray-300">Due Date: {task.dueDate}</p>}
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="task-delete text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Task;
