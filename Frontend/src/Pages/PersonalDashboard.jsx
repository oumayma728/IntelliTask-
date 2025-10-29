import Navbar from "../Components/Navbar"
import  Sidebar  from "../Components/Sidebar"
import Task from "../Pages/Task"

export default function PersonalDashboard() {
  return (
    <div className=" bg-gray-900 text-white flex flex-col">
      <Navbar />
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Task />
        </div>
      </div>
    </div>
  );
}
