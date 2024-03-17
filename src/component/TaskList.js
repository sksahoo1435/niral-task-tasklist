import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      if (parsedTasks.length > 0) {
        setTasks(parsedTasks);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (editMode) {
      const newTasks = [...tasks];
      newTasks[editIndex] = taskText;
      setTasks(newTasks);
      setEditMode(false);
      setEditIndex(null);
    } else {
      setTasks([...tasks, taskText]);
    }
    setTaskText('');
    setOpen(false);
  };

  const handleEditTask = (index) => {
    setTaskText(tasks[index]);
    setEditMode(true);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="relative h-5/6">
      <div className="relative flex justify-center z-20 p-4 h-20">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setOpen(true)}
        >
          Add Task
        </button>
      </div>
      <div className="min-h-5/6 flex justify-center items-center border border-gray-300 rounded-md shadow-md p-4 bg-gray-50 overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 overflow-y-auto no-scrollbar" style={{ maxHeight: "80dvh" }}>
          {tasks && tasks.length === 0 ? 
          <div className="min-h-40 flex justify-center items-center">
                <h2>There is no task added yet. please enter your task.</h2>
          </div> : tasks.map((task, index) => (
            <div key={index} className="border border-gray-300 rounded-md shadow-md p-5 hover:scale-105 transition-transform min-h-44 w-52" >
              <div className="border-b border-gray-300 min-h-36">{task}</div>
              <div className="flex justify-around mt-2">
                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditTask(index)}>
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteTask(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <Transition appear show={open} as={Dialog} onClose={() => setOpen(false)}>
          <Dialog onClose={() => setOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <Transition.Child
                as={React.Fragment}
                enter="transition-opacity ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
              </Transition.Child>

              <Transition.Child
                as={React.Fragment}
                enter="transition-opacity ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="bg-white rounded-lg p-4 z-20">
                  <Dialog.Title>{editMode ? 'Edit Task' : 'Add Task'}</Dialog.Title>
                  <div className="mt-2">
                    <input
                      autoFocus
                      className="border border-gray-300 rounded w-full py-2 px-3"
                      type="text"
                      placeholder="Task"
                      value={taskText}
                      onChange={(e) => setTaskText(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 flex justify-evenly">
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => setOpen(false)}>
                      Cancel
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddTask}>
                      {editMode ? 'Save' : 'Add'}
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default TaskList;
