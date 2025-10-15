import { FaSearch, FaFilter, FaAngleDoubleDown, FaTable } from "react-icons/fa";
import { useEffect, useState } from "react";
import useTasks from "../hooks/useTasks";

export default function TaskToolbar() {
const {tasks:initialTasks,addTask} =useTasks();
const [tasks,setTasks] =useState([]);
const [editingRow ,setEditingRow] =useState(null);
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
    const handleNewTask = () => {
    const newTask = { id: Date.now(), title: "", description: "", status: "pending", isNew: true };
    setTasks([newTask, ...tasks]);
    setEditingRow(newTask.id);
  };

  const handleChange = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };
    const handleSave = async (task) => {
    // Call backend only for new tasks
    if (task.isNew) {
      await addTask(task); // your hook
      setEditingRow(null);
    }
  };
  return (
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
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaSearch /> Search
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaFilter /> Filter
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <FaAngleDoubleDown /> Sort
          </button>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <button className="hover:text-white transition">Group by</button>
          <button className="text-2xl hover:text-white transition">⋯</button>
        </div>
      </div>
    </nav>
  );
}
