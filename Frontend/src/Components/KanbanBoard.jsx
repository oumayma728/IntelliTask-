import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import { useLoader } from '../Context/LoaderContext';

import KanbanColumn from "../Components/KanbanColumn";

const KanbanBoard = () => {
  const { tasks, fetchTasks, deleteTask, updateTask, addTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const columns = [
    { id: "To Do", title: "To Do", color: "bg-blue-600" },
    { id: "In Progress", title: "In Progress", color: "bg-yellow-600" },
    { id: "Done", title: "Done", color: "bg-green-600" },
  ];

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        showLoader();
        setError(null);
        await fetchTasks();
      } catch (error) {
        console.error("Error loading tasks:", error);
        setError("Failed to load tasks");
      } finally {
        hideLoader();
      }
    };
    loadTasks();
  }, [fetchTasks, showLoader, hideLoader]);

  // Filter tasks
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = safeTasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.Status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (task.Title && task.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.Description && task.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.ProjectName && task.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col justify-start p-8">
      
      {/* Top Nav / Tabs */}
      <nav className="w-full border-b border-gray-700  top-0 z-10">
        <div className="px-8 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-wide">
              Kanban Board
            </h2>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
          <button onClick={() => navigate("/Task")} className=" hover:text-white pb-2">Table</button>
          <button className="border-b-2 border-blue-500 pb-2  font-medium">Kanban</button>
          <button onClick={() => navigate("/Calendar")} className=" hover:text-white pb-2">Calendar</button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" px-3 py-2 rounded w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className=" px-3 py-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className=" text-sm">
            {filteredTasks.length} tasks found
          </div>
        </div>
      </nav>

      {/* Error Display */}
      {error && (
        <div className="mx-8 mt-4 bg-red-600 text-white p-3 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle />
          {error}
        </div>
      )}

      {/* Kanban Board */}
      <div className="kanban-board mt-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.Status === column.id);
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                addTask={addTask}
                fetchTasks={fetchTasks}
                updatingTaskId={updatingTaskId}
                columns={columns}
              />
            );
          })}
        </div>

        {/* Empty State for Entire Board */}
        {filteredTasks.length === 0 && !editingTask && (
          <div className="text-center  mt-8">
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            <p>No tasks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
