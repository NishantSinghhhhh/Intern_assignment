'use client';

import React, { useEffect, useState , useCallback } from 'react';
import Draggable from 'react-draggable';
import Navbar from '@/elements/Navbar'; // Adjust the import path as needed
import { useUser } from '@/context/UserContext'; // Adjust the import path as needed
import { Clock, AlertTriangle } from 'lucide-react'; // Import your icons here

const Kanban = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Function to create random tasks for demo purposes
  const createRandomTask = (status) => ({
    id: Math.random().toString(36).substr(2, 9),
    title: `Task ${Math.floor(Math.random() * 100)}`,
    description: 'This is a random task description.',
    status,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks for user ID:', user.id);
        const response = await fetch(`http://localhost:8000/auth/fetchtasks/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          console.log('Fetched tasks:', data);
          const organizedTasks = {
            todo: [],
            inProgress: [],
            done: [],
          };

          data.tasks.forEach((task) => {
            if (task.status === 'To Do') {
              organizedTasks.todo.push(task);
            } else if (task.status === 'In Progress') {
              organizedTasks.inProgress.push(task);
            } else if (task.status === 'Done') {
              organizedTasks.done.push(task);
            }
          });

          setTasks(organizedTasks);
        } else {
          console.error('Error fetching tasks:', data.message);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user.id) {
      fetchTasks();
    } else {
      // Create random tasks for demo if no user ID
      setTasks({
        todo: [createRandomTask('To Do'), createRandomTask('To Do')],
        inProgress: [createRandomTask('In Progress')],
        done: [createRandomTask('Done')],
      });
    }
  }, [user.id]);

  const handleDrag = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      const task = Object.values(newTasks).flat().find((t) => t.id === taskId);
      if (task) {
        newTasks[task.status.toLowerCase()].splice(newTasks[task.status.toLowerCase()].indexOf(task), 1);
        task.status = newStatus;
        newTasks[newStatus.toLowerCase()].push(task);
      }
      return newTasks;
    });
  };

  const handleStop = useCallback((taskId, x) => {
    const newStatus = x > 200 ? (tasks.todo.some(t => t.id === taskId) ? 'In Progress' : 'Done') : 'To Do';
    handleDrag(taskId, newStatus);
  }, [tasks]);


  return (
   <div className="flex gap-6 p-6 overflow-x-auto">
      {Object.keys(tasks).map((status) => (
        <div key={status} className="bg-gray-800 rounded-lg shadow-lg p-4 w-1/4 min-w-[250px]">
          <h2 className="text-white text-lg font-bold mb-4 capitalize">{status}</h2>
          {tasks[status].map((task) => (
            <Draggable key={task.id} onStop={(e, data) => handleStop(task.id, data.x)}>
              <div
                className="task-item bg-black/30 backdrop-filter backdrop-blur-md p-6 rounded-xl border border-blue-500/20 shadow-xl transition-all duration-200 hover:bg-black/50 mb-4 cursor-pointer"
                onClick={() => console.log(task)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-white mb-2 sm:mb-0">{task.title}</h4>
                </div>
                <p className="text-gray-300 mb-6">{task.description}</p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center text-gray-300">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      task.status === 'Completed' ? 'bg-green-500' :
                      task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span>{task.status}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={18} className="mr-2" />
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
                  <div className="flex items-center text-gray-300">
                    <AlertTriangle size={18} className="mr-2" />
                    <span>{task.priority}</span>
                  </div>
                </div>
              </div>
            </Draggable>
          ))}
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  return (
    <div className="bg-black min-h-screen w-full">
      <Navbar />
      <Kanban />
    </div>
  );
};

export default Page;
