'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import Navbar from '@/elements/Navbar'; // Adjust the import path as needed
import { useUser } from '@/context/UserContext'; // Adjust the import path as needed

const Kanban = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });

  const todoColumnRef = useRef(null);
  const inProgressColumnRef = useRef(null);
  const completedColumnRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks for user ID:', user.id);
        const response = await fetch(`https://intern-assignment-backend-nishant-singhs-projects-7b2e026b.vercel.app/auth/fetchtasks/${user.id}`);
        const data = await response.json();
    
        console.log('Fetched data:', data); // Log the raw data
    
        if (response.ok) {
          const organizedTasks = {
            todo: [],
            inProgress: [],
            completed: [],
          };
    
          data.tasks.forEach((task) => {
            // Check the actual status values from the backend
            if (task.status === 'To Do') {
              organizedTasks.todo.push(task);
            } else if (task.status === 'In Progress') { // Use the actual status
              organizedTasks.inProgress.push(task);
            } else if (task.status === 'Completed') { // Use the actual status
              organizedTasks.completed.push(task);
            }
          });
    
          console.log('Organized tasks:', organizedTasks); // Log organized tasks
    
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
    }
  }, [user.id]);

  const checkDropLocation = (x, y) => {
    let todoRect, inProgressRect, completedRect;

    if (todoColumnRef.current) {
      todoRect = todoColumnRef.current.getBoundingClientRect();
    }

    if (inProgressColumnRef.current) {
      inProgressRect = inProgressColumnRef.current.getBoundingClientRect();
    }

    if (completedColumnRef.current) {
      completedRect = completedColumnRef.current.getBoundingClientRect();
    }

    if (todoRect && x >= todoRect.left && x <= todoRect.right && y >= todoRect.top && y <= todoRect.bottom) {
      return 'To Do';
    } else if (inProgressRect && x >= inProgressRect.left && x <= inProgressRect.right && y >= inProgressRect.top && y <= inProgressRect.bottom) {
      return 'In Progress';
    } else if (completedRect && x >= completedRect.left && x <= completedRect.right && y >= completedRect.top && y <= completedRect.bottom) {
      return 'Completed';
    } else {
      return null;
    }
  };

  const handleCardMove = useCallback(async (task, newStatus) => {
    console.log('Function called: handleCardMove');
    console.log(`Moving task ${task._id} to ${newStatus}`, task);
  
    // Map newStatus to the correct enum value
    let mappedStatus;
    if (newStatus === 'todo') {
      mappedStatus = 'To Do';
    } else if (newStatus === 'inProgress') {
      mappedStatus = 'In Progress';
    } else if (newStatus === 'done') {
      mappedStatus = 'Completed';
    }
  
    try {
      const response = await fetch(`https://intern-assignment-backend-nishant-singhs-projects-7b2e026b.vercel.app/auth/updatetaskStatus/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: mappedStatus }), // Send the mapped status
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating task:', errorData.message);
        return;
      }
  
      const updatedTodo = await response.json();
      console.log('Task updated successfully:', updatedTodo.todo);
      // Optionally, update your local state here if needed
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);
  
  
  const handleStop = useCallback(
    (e, data, task) => {
      console.log(`Task drag stopped at X: ${data.x}px, Y: ${data.y}px`);
      const newStatus = checkDropLocation(e.clientX, e.clientY);
      if (newStatus) {
        handleCardMove(task, newStatus); // Pass the entire task object
      }
    },
    [handleCardMove]
  );

  const handleCardClick = (task) => {
    console.log('Card clicked:', task);
  };

  return (
    <div className="flex gap-6 p-6 h-[100vh] ">
  {/* "To Do" Column */}
  <div
    ref={todoColumnRef}
    className="todo-column h-[40%] bg-blue-900 backdrop-filter backdrop-blur-md bg-gray-900/70 backdrop-filter backdrop-blur-md  rounded-lg shadow-lg p-4 flex-1 min-w-[250px] transform transition-transform duration-100 hover:shadow-lg"
  >
    <h2 className="text-white text-lg font-bold mb-4">To Do</h2>
    {tasks.todo.map((task) => (
      <Draggable key={task._id} onStop={(e, data) => handleStop(e, data, task)}>
        <div
          className="task-item bg-gray-900/70 backdrop-blur-md p-6 rounded-xl border border-blue-500/20 shadow-xl transition-all duration-200 hover:bg-gray-900/80 mb-4 cursor-move select-none"
          onClick={() => handleCardClick(task)}
        >
          <h4 className="text-2xl font-bold text-white mb-2">{task.title}</h4>
          <p className="text-gray-300">{task.description}</p>
        </div>
      </Draggable>
    ))}
  </div>

  <div
    ref={inProgressColumnRef}
    className="in-progress-column h-[40%]  bg-blue-900 backdrop-filter backdrop-blur-md rounded-lg shadow-lg p-4 flex-1 min-w-[250px]"
    style={{
      transform: 'translate(0, 0)',
      transition: 'box-shadow 0.3s ease, transform 0.1s ease',
    }}
  >
    <h2 className="text-white text-lg font-bold mb-4">In Progress</h2>
    {tasks.inProgress.map((task) => (
      <Draggable key={task._id} onStop={(e, data) => handleStop(e, data, task)}>
        <div
          className="task-item bg-gray-900/70 backdrop-filter backdrop-blur-md p-6 rounded-xl border border-blue-500/20 shadow-xl transition-all duration-200 hover:bg-gray-900/80 mb-4 cursor-move select-none"
          onClick={() => handleCardClick(task)}
        >
          <h4 className="text-2xl font-bold text-white mb-2">{task.title}</h4>
          <p className="text-gray-300">{task.description}</p>
        </div>
      </Draggable>
    ))}
  </div>

  {/* "Completed" Column */}
  <div
    ref={completedColumnRef}
    className="completed-column bg-blue-900 backdrop-filter backdrop-blur-md h-[40%] rounded-lg shadow-lg p-4 flex-1 min-w-[250px]"
    style={{
      transform: 'translate(0, 0)',
      transition: 'box-shadow 0.3s ease, transform 0.1s ease',
    }}
  >
    <h2 className="text-white text-lg font-bold mb-4">Completed</h2>
    {tasks.completed.map((task) => (
      <Draggable key={task._id} onStop={(e, data) => handleStop(e, data, task)}>
        <div
          className="task-item bg-gray-900/70 backdrop-filter backdrop-blur-md p-6 rounded-xl border border-blue-500/20 shadow-xl transition-all duration-200 hover:bg-gray-900/80 mb-4 cursor-move select-none"
          onClick={() => handleCardClick(task)}
        >
          <h4 className="text-2xl font-bold text-white mb-2">{task.title}</h4>
          <p className="text-gray-300">{task.description}</p>
        </div>
      </Draggable>
    ))}
  </div>
</div>

  );
  
};

const Page = () => {
  return (
    <div className="bg-black bg-gradient-to-br from-gray-900 via-blue-950 to-black  min-h-screen w-full">
      <Navbar />
      <Kanban />
    </div>
  );
};

export default Page;
