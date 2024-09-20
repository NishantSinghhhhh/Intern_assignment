'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Navbar from '@/elements/Navbar'; // Assuming Navbar is imported correctly

const initialTasks = {
  todo: [
    { id: '1', content: 'Task 1' },
    { id: '2', content: 'Task 2' },
    { id: '3', content: 'Task 3' },
  ],
  inProgress: [
    { id: '4', content: 'Task 4' },
  ],
  done: [
    { id: '5', content: 'Task 5' },
  ],
};

const Kanban = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // If dropped outside the droppable area

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return; // If the task is dropped in the same position
    }

    // Moving task within the same list or between different lists
    const sourceList = Array.from(tasks[source.droppableId]);
    const destinationList = Array.from(tasks[destination.droppableId]);

    const sourceTaskIndex = sourceList.findIndex((task) => task.id === draggableId);
    const [removedTask] = sourceList.splice(sourceTaskIndex, 1); // Remove task from source

    destinationList.splice(destination.index, 0, removedTask); // Add task to the destination

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex justify-around">
          {Object.keys(tasks).map((columnKey) => (
            <Droppable droppableId={columnKey} key={columnKey}>
              {(provided) => (
                <div
                  className="w-1/3 p-4 bg-black/30 backdrop-filter backdrop-blur-lg rounded-lg border border-blue-500/20 shadow-xl"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="text-xl text-white font-bold capitalize mb-4">
                    {columnKey.replace(/([A-Z])/g, ' $1')}
                  </h2>
                  {tasks[columnKey].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-black/50 text-white p-4 mb-4 rounded-lg shadow-md border border-blue-500/30 cursor-grab"
                          style={{ ...provided.draggableProps.style, userSelect: 'none' }}
                        >
                          <span className="cursor-grab hover:text-blue-300 transition duration-300 ease-in-out text-lg mr-2">
                            &#x2693; {/* Drag handle icon */}
                          </span>
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const Page = () => {
  return (
    <div className="bg-black min-h-screen w-full">
      <div>
        <Navbar />
      </div>
      <div>
        <Kanban />
      </div>
    </div>
  );
};

export default Page;
