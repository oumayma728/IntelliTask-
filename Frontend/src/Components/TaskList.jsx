import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaAngleDoubleDown, FaTable } from "react-icons/fa";

import useTasks from "../hooks/useTasks";

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksState , setTasksState] =useState([]); //an array containing all tasks
  const[editingRow,setEditingRow]=useState(null); //stores the id of the row currently being edited
    const { tasks, fetchTasks, addTask,deleteTask } = useTasks();
    const [statusFilter , setStatusFilter]=useState("all")
useEffect(() => {
  fetchTasks();
}, [fetchTasks]);
const filteredTask = tasksState.filter((task) => {
  if (statusFilter === "all") return true;
  return task.status === statusFilter;
});
useEffect(() => {
  setTasksState(tasks);
}, [tasks]);

  const handleNewTask = ()=>{
    const newTask ={
       id: Date.now(),
    title: "",
    description: "",
    dueDate: "",
    projectName: "",
    status: "pending",
    isNew: true
    }
     setTasksState([newTask, ...tasksState]);
  setEditingRow(newTask.id);
  };
  
  const handleChange = (id, field, value) => {
    setTasksState(
      tasksState.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = async (task) => {
    if (task.isNew) {
      // Call backend addTask
       const savedTask = await addTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      projectName: task.projectName,
      status: task.status,
    });

         setTasksState(tasksState.map(t => t.id === task.id ? savedTask : t));
    setEditingRow(null);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


const filteredTasks = tasksState.filter((task) => {
  const matchesStatus = statusFilter === "all" || task.status === statusFilter;
  const matchesSearch =
    !searchTerm ||
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.projectName.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesStatus && matchesSearch;
});




  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-start p-8">
      <nav className="w-full border-b border-gray-700 bg-gray-900 text-white sticky top-0 z-10">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-3xl font-semibold tracking-wide">Tasks</h2>
            </div>
      
            <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
              <button className="border-b-2 border-blue-500 pb-2 text-white font-medium">Table</button>
              <button className="text-gray-400 hover:text-white pb-2">Kanban</button>
              <button className="text-gray-400 hover:text-white pb-2">Calendar</button>
              <button className="text-gray-400 hover:text-white pb-2 text-xl font-bold">+</button>
            </div>
      
            <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
              <div className="flex items-center gap-3">
                <button onClick={handleNewTask} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition">
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
  <option value="open">Open</option>
  <option value="pending">Pending</option>
  <option value="completed">Completed</option>
</select>
              </div>
  
            </div>
          </nav>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
           {filteredTasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-600">
              <td className="px-4 py-2">
                {editingRow === task.id ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleChange(task.id, "title", e.target.value)}
                    className="bg-gray-700 px-2 py-1 rounded w-full"
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.id ? (
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) =>
                      handleChange(task.id, "description", e.target.value)
                    }
                    className="bg-gray-700 px-2 py-1 rounded w-full"
                  />
                ) : (
                  task.description
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.id ? (
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) =>
                      handleChange(task.id, "dueDate", e.target.value)
                    }
                    className="bg-gray-700 px-2 py-1 rounded"
                  />
                ) : (
                  formatDate(task.dueDate)
                )}
              </td>
              <td className="px-4 py-2">
                {editingRow === task.id ? (
                  <input
                    type="text"
                    value={task.projectName}
                    onChange={(e) =>
                      handleChange(task.id, "projectName", e.target.value)
                    }
                    className="bg-gray-700 px-2 py-1 rounded w-full"
                  />
                ) : (
                  task.projectName
                )}
              </td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">
                {editingRow === task.id && (
                  <button
                    onClick={() => handleSave(task)}
                    className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
                  >
                    Save
                  </button>
                )}
                </td>
                <td className="px-4 py-2">
                <button 
                onClick={()=>deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"

                >
                  Delete
                </button></td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
