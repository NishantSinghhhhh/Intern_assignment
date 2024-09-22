'use client';

import Navbar from '../../../elements/Navbar';
import Task from '../../../elements/task'

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
