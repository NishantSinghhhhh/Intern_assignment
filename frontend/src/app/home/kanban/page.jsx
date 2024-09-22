import Navbar from '@/elements/Navbar'; // Adjust the import path as needed
import Kanban from '../../../elements/Kanban'

const Page = () => {
  return (
    <div className="bg-black bg-gradient-to-br from-gray-900 via-blue-950 to-black  min-h-screen w-full">
      <Navbar />
      <Kanban />
    </div>
  );
};

export default Page;
