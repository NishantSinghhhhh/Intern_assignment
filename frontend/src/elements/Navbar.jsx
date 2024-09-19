import React from 'react';
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
        <nav className="flex justify-between items-center p-4 bg-black rounded-lg shadow-lg opacity-80 border border-gray-700 w-[80%] h-[20%] mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-400 mr-4"></div>
            <h1 className="text-2xl font-bold text-white">Inventory</h1>
          </div>
          <ul className="flex space-x-4">
            <li><Link href="/home/tasks" passHref><span className="text-white px-3 py-1 rounded hover:underline">Tasks</span></Link></li>
            <li><Link href="/home/kanban" passHref><span className="text-white px-3 py-1 rounded hover:underline">Customers</span></Link></li>
          </ul>
        </nav> 
    </div>
  );
};

export default Navbar;
