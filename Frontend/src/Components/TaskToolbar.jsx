import { FaSearch, FaFilter, FaAngleDoubleDown, FaTable } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTasks from "../hooks/useTasks";

export default function TaskToolbar() {
const {tasks,addTask} =useTasks();
const [editingRow ,setEditingRow] =useState(null);
const navigate =useNavigate();
  

const handleNewItem = (type = "task") => {
  const newItem = {
    id: Date.now(),
    title: type === "task" ? "" : "New Project",
    description: "",
    status: "pending",
    isNew: true,
    isProjectHeader: type === "project"
  };
  // Add new item at the top
  setEditingRow(newItem.id);
  addTask(newItem); // optional: save immediately if you want
};


const toolbarButtons = [
    { label: "Table", action: () => {}, active: true },
    { label: "Kanban", action: () => navigate("/KanbanBoard") },
    { label: "Calendar", action: () => navigate("/Calendar") },
  ];

  
  return (
    <nav className="w-full border-b border-gray-700 bg-gray-900 text-white sticky top-0 z-10">
      <div className="px-8 pt-6 pb-2">
        <h2 className="text-3xl font-semibold tracking-wide">Tasks</h2>
      </div>

      <div className="flex items-center px-8 space-x-8 border-b border-gray-700 pb-2">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className={`pb-2 ${
              btn.active ? "border-b-2 border-blue-500 text-white font-medium" : "text-gray-400 hover:text-white"
            }`}
          >
            {btn.label}
          </button>
        ))}

      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-700 mt-2">
        <div className="flex items-center gap-3">
          <button onClick={handleNewItem("task")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition">
            <FaTable /> New Task
          </button>
          <button onClick={handleNewItem("project")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition">
            <FaTable /> New Project
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
      </div>
    </nav>
  );
}
