import React from 'react';
// import Link from 'next/link';
import Navbar from '../../elements/Navbar';

const Page = () => {
  return (
    <div className="bg-black overflow-hidden h-[120vh] bg-gradient-to-br from-gray-900 via-blue-950 to-black">
      <div>
        <Navbar />
      </div>
      <div className="h-[100vh]  flex items-center justify-center">
        <h1 className="text-white text-8xl font-bold flex flex-col h-[50vh]">
        <span className="text-transparent mb-[30px] bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Kanban Board</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Inventory</span>
      </h1>
      </div>
    </div>
  );
};

export default Page;