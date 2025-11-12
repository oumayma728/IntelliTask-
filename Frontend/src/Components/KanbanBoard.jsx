import { useEffect, useState } from "react";
import {
  FaColumns,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useTasks from "../hooks/useTasks";

const KanbanBoard = () => {
  const { tasks, fetchTasks, deleteTask, updateTask, addTask } = useTasks();
const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleNewTask = () => {
    const newTask = {
      Id: Date.now(),
      Title: "",
      Description: "",
      DueDate: "",
      ProjectName: "",
      Status: "To Do",
      isNew: true
    };
    setEditingTask(newTask);
  };

  const handleChange = (field, value) => {
  // Just update the single editing task
  setEditingTask({ ...editingTask, [field]: value });
};

  const handleSave = async (task) => {
    if (task.isNew) {
      try {
        const savedTask = await addTask({
          Title: task.Title,
          Description: task.Description,
          DueDate: task.DueDate,
          ProjectName: task.ProjectName,
          Status: task.Status,
        });

        if (savedTask?.Id) {
        setEditingTask(null); // ✅ Just clear the editing state
        await fetchTasks(); // ✅ This updates `tasks` from the hook
      }
    } catch (error) {
      alert('Please fill all required fields correctly');
    }
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Fetch tasks when component loads
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchTasks();
      } catch (error) {
        console.error("Error loading tasks:", error);
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [fetchTasks]);

  // Data filtering
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" || task.Status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (task.Title &&
        task.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.Description &&
        task.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.ProjectName &&
        task.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId.toString()); //Saves the taskId in dataTransfer so it can be retrieved when dropped
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; //Allows a column to accept a drop.

  };

  const handleDrop = async (e, newStatus) => {
  e.preventDefault();
  const taskId = parseInt(e.dataTransfer.getData("taskId"));
  
  try {
    setUpdatingTaskId(parseInt(taskId));
    const task = tasks.find(t => t.Id === taskId);
    
    // ✅ Just update the backend, then refresh
    await updateTask(task.Id, {
      ...task,
      Status: newStatus
    });
    
    await fetchTasks(); // ✅ Updates `tasks` from hook
  } catch (error) {
    setError(`Failed to move task: ${error.message}`);
  } finally {
    setUpdatingTaskId(null);
  }
};

  // Update task status (for button clicks)
  const handleStatusChange = async (taskId, newStatus) => {
  try {
    setUpdatingTaskId(taskId);
    const task = tasks.find((t) => t.Id === taskId);
    
    //Just update backend, then refresh
    await updateTask(task.Id, {
      ...task,
      Status: newStatus
    });
    
    await fetchTasks(); //This updates `tasks`
  } catch (error) {
    setError(`Failed to update task: ${error.message}`);
  } finally {
    setUpdatingTaskId(null);
  }
};

  const columns = [
    { id: "To Do", title: "To Do", color: "bg-blue-600" },
    { id: "In Progress", title: "In Progress", color: "bg-yellow-600" },
    { id: "Done", title: "Done", color: "bg-green-600" },
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mb-4 mx-auto" />
          <p className="text-xl">Loading Kanban Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-start p-8">
      <nav className="w-full border-b border-gray-700 bg-gray-900 text-white sticky top-0 z-10">
        <div className="px-8 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-wide">
              Kanban Board
            </h2>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
          <button
            onClick={() => navigate("/Task")}
            className="text-gray-400 hover:text-white pb-2"
          >
            Table
          </button>
          <button className="border-b-2 border-blue-500 pb-2 text-white font-medium flex items-center gap-2">
            <FaColumns /> Kanban
          </button>
          <button
            onClick={() => navigate("/Calendar")}
            className="text-gray-400 hover:text-white pb-2"
          >
            Calendar
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="text-gray-400 text-sm">
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
            const columnTasks = filteredTasks.filter(
              (task) => task && task.Status === column.id
            );

            return (
              <div
                key={column.id}
                className="flex-1 min-w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div
                  className={`${column.color} text-white p-3 rounded-t-lg flex justify-between items-center`}
                >
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="bg-black bg-opacity-30 px-2 py-1 rounded text-sm">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="bg-gray-800 p-3 rounded-b-lg min-h-96">
                  {/* Add Task Button */}
                  <div
                    onClick={() => handleNewTask(column.id)}
                    className="text-gray-400 text-center py-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors mb-3"
                  >
                    + Add Task
                  </div>

                  {columnTasks.map(
                    (task) =>
                      task && (
                        <div
                          key={task.Id}
                          draggable={!task.isNew && updatingTaskId !== task.Id}
                          onDragStart={(e) => handleDragStart(e, task.Id)}
                          className={`bg-gray-700 p-3 rounded-lg mb-3 cursor-move hover:bg-gray-600 transition relative ${updatingTaskId === task.Id ? "opacity-50" : ""
                            } ${task.isNew ? "border-2 border-yellow-400" : ""}`}
                        >
                          {updatingTaskId === task.Id && (
                            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                              <FaSpinner className="animate-spin text-blue-500" />
                            </div>
                          )}

                          {editingTask && editingTask.Id === task.Id ? (
                            // Edit Mode
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={task.Title || ""}
                                onChange={(e) => handleChange("Title", e.target.value)}
                                className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                                placeholder="Title *"
                              />
                              <input
                                type="text"
                                value={task.Description || ""}
                                onChange={(e) => handleChange(task.Id, "Description", e.target.value)}
                                className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                                placeholder="Description"
                              />
                              <input
                                type="date"
                                value={task.DueDate || ""}
                                onChange={(e) => handleChange(task.Id, "DueDate", e.target.value)}
                                className="bg-gray-600 text-white px-2 py-1 rounded border border-gray-500"
                              />
                              <input
                                type="text"
                                value={task.ProjectName || ""}
                                onChange={(e) => handleChange(task.Id, "ProjectName", e.target.value)}
                                className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                                placeholder="Project Name *"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSave(task)}
                                  className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm flex-1"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleCancelEdit(task.Id)}
                                  className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm flex-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              {/* Task Header */}
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">
                                  {task.Title || "Untitled"}
                                </h4>
                                {task.ProjectName && (
                                  <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                                    {task.ProjectName}
                                  </span>
                                )}
                              </div>

                              {/* Task Description */}
                              <p className="text-gray-300 text-sm mb-2">
                                {task.Description || "No description"}
                              </p>

                              {/* Task Footer */}
                              <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>{formatDate(task.DueDate)}</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingTask(task)}
                                    className="text-blue-400 hover:text-blue-300"
                                    disabled={updatingTaskId === task.Id}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this task?"
                                        )
                                      ) {
                                        deleteTask(task.Id);
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300"
                                    disabled={updatingTaskId === task.Id}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>

                              {/* Status Buttons */}
                              <div className="flex gap-1 mt-2">
                                {columns.map(
                                  (col) =>
                                    col.id !== task.Status && (
                                      <button
                                        key={col.id}
                                        onClick={() =>
                                          handleStatusChange(task.Id, col.id)
                                        }
                                        disabled={updatingTaskId === task.Id}
                                        className={`text-xs px-2 py-1 rounded flex-1 ${col.id === "In Progress"
                                            ? "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800"
                                            : col.id === "To Do"
                                              ? "bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800"
                                              : "bg-green-600 hover:bg-green-500 disabled:bg-green-800"
                                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                                      >
                                        Move to {col.title}
                                      </button>
                                    )
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                  )}

                  {/* Empty State */}
                  {columnTasks.length === 0 && !editingTask && (
                    <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State for Entire Board */}
        {filteredTasks.length === 0 && !isLoading && !editingTask && (
          <div className="text-center text-gray-400 mt-8">
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            <p>No tasks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;