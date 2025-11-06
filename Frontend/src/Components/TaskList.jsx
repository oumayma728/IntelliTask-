import { useEffect, useState } from "react";
import {  FaTable } from "react-icons/fa";
import useTasks from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";


export default function Tasks() {
  const { tasks, fetchTasks, addTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksState, setTasksState] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetching tasks...");
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);

  const handleNewTask = () => {
    const newTask = {
      Id: Date.now(),
      Title: "",
      Description: "",
      DueDate: "",
      ProjectName: "",
      Status: "Open",
      isNew: true
    };
    setTasksState([newTask, ...tasksState]);
    setEditingRow(newTask.Id);
  };

 const handleChange = (Id, field, value) => {
  setTasksState(
    tasksState.map((t) => (t.Id === Id ? { ...t, [field]: value } : t))
  );
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


        if (savedTask && savedTask.Id) {
          setTasksState(tasksState.map(t => t.Id === task.Id ? { ...savedTask, isNew: false } : t));
          setEditingRow(null);
        }
      } catch (error) {
        console.error('Save task error details:', error);
        if (error.errors) {
          console.log('ValIdation errors:', error.errors);
          alert('Please fill all required fields correctly');
        }
      }
    }
  };
  const handleCancelEdit = (taskId) => {
    // If it's a new task that wasn't saved, remove it
    const task = tasksState.find(t => t.Id === taskId);
    if (task && task.isNew) {
      setTasksState(tasksState.filter(t => t.Id !== taskId));
    }
    setEditingRow(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredTasks = tasksState.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.Status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (task.Title && task.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.Description && task.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.ProjectName && task.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-start p-8">
      <nav className="w-full border-b border-gray-700 bg-gray-900 text-white sticky top-0 z-10">
        <div className="px-8 pt-6 pb-2">
          <h2 className="text-3xl font-semibold tracking-wIde">Tasks</h2>
        </div>

        <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
          <button className="border-b-2 border-blue-500 pb-2 text-white font-medium">Table</button>
          <button className="text-gray-400 hover:text-white pb-2">Kanban</button>
          <button onClick={() => navigate("/Calendar")}  className="text-gray-400 hover:text-white pb-2">Calendar</button>
          <button className="text-gray-400 hover:text-white pb-2 text-xl font-bold">+</button>
        </div>

        <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleNewTask} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition"
            >
              <FaTable /> New Task
            </button>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="Completed">Completed</option>
              <option value="Uncomplete">Uncomplete</option>

            </select>
          </div>
        </div>
      </nav>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.Id} className="border-b border-gray-600 hover:bg-gray-800">
              <td className="px-4 py-2">
                {editingRow === task.Id ? (
                  <input
                    type="text"
                    value={task.Title || ""}
                    onChange={(e) => handleChange(task.Id, "Title", e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full border border-gray-600"
                    placeholder="Enter title *"
                  />
                ) : (
                  task.Title || "Untitled"
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.Id ? (
                  <input
                    type="text"
                    value={task.Description || ""}
                    onChange={(e) => handleChange(task.Id, "Description", e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full border border-gray-600"
                    placeholder="Enter description *"
                  />
                ) : (
                  task.Description || "No description"
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.Id ? (
                  <input
                    type="date"
                    value={task.DueDate || ""}
                    onChange={(e) => handleChange(task.Id, "DueDate", e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
                  />
                ) : (
                  formatDate(task.DueDate)
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.Id ? (
                  <input
                    type="text"
                    value={task.ProjectName || ""}
                    onChange={(e) => handleChange(task.Id, "ProjectName", e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full border border-gray-600"
                    placeholder="Enter project name *"
                  />
                ) : (
                  task.ProjectName || "No project"
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.Id ? (
                  <select
                    value={task.Status || "Open"}
                    onChange={(e) => handleChange(task.Id, "Status", e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
                  >
                    <option value="Open">Open</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.Status === "Completed" ? "bg-green-600" : "bg-blue-600"
                  }`}>
                    {task.Status}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                {editingRow === task.Id ? (
                  <>
                    <button
                      onClick={() => handleSave(task)}
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancelEdit(task.Id)}
                      className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingRow(task.Id)}
                      className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() =>{ 
                        deleteTask(task.Id);
                      }}
                      
                      className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                No tasks found. {searchTerm ? "Try changing your search." : "Create your first task!"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}