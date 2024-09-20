import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-black p-4 sm:p-8">
      <nav className="flex justify-between items-center p-4 bg-black/30 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl border border-blue-500/20 w-[90%] mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 mr-4"></div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Inventory
          </h1>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/home/tasks" passHref>
              <span className="text-white px-3 py-1 rounded hover:underline">Tasks</span>
            </Link>
          </li>
          <li>
            <Link href="/home/kanban" passHref>
              <span className="text-white px-3 py-1 rounded hover:underline">Kanban</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
