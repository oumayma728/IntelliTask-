import { FaSearch, FaFilter, FaAngleDoubleDown, FaUser, FaEye, FaTable } from "react-icons/fa";

export default function TaskToolbar() {
  return (
    <nav className="w-full border-b border-gray-700 bg-gray-900 text-white">
      {/* Header Title */}
      <div className="px-8 pt-6 pb-2">
        <h2 className="text-3xl font-semibold tracking-wide">Tasks</h2>
      </div>

      {/* View Tabs */}
      <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
        <button className="border-b-2 border-blue-500 pb-2 text-white font-medium">
          Table
        </button>
        <button className="text-gray-400 hover:text-white pb-2">Kanban</button>
        <button className="text-gray-400 hover:text-white pb-2">Calendar</button>
        <button className="text-gray-400 hover:text-white pb-2 text-xl font-bold">+</button>
      </div>

      {/* Toolbar Actions */}
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition">
            <FaTable />
            New Task
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaSearch />
            Search
          </button>
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaFilter />
            Filter
        </button>

        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaAngleDoubleDown />
            Sort
        </button>

        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 text-gray-300">
          <button className="hover:text-white transition">Group by</button>
          <button className="text-2xl hover:text-white transition">⋯</button>
        </div>
      </div>
    </nav>
  );
}
