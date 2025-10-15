import { useState, useCallback } from "react";

export default function useTasks() {
  const [tid, setTid] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🟢 Add task
  const addTask = async (payload) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) throw new Error("Add failed");

      const newTask = await response.json();
      // Update tasks in state
      setTasks((prev) => [...prev, newTask]);
      console.log("Task added successfully:", newTask);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  // 🟢 Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      // Update state locally (no need to refetch)
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      console.log("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  // ✅ Return everything you need
  return {
    tid,
    setTid,
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    deleteTask,
  };
}
