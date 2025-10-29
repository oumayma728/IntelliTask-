import { useState, useCallback } from "react";
import { GetAllTasks, CreateTask, DeleteTask, UpdateTask } from "../api/TaskApi";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await GetAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add task
 const addTask = async (task) => {
  try {
    const newTask = await CreateTask(task);
    setTasks((prev) => [...prev, newTask]);
    return newTask; 
  } catch (err) {
    setError(err.message);
    throw err;   
  }
};

  // Delete task
  const deleteTask = async (taskId) => {
    try { 

      await DeleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    }catch(err)
    {
      setError(err.message);
    }
  };
//update task
const updatedTaskById = async (taskId , updatedtask)=>{
  try{
    const updated = await UpdateTask(taskId,updatedtask);
    setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    deleteTask,
    updatedTaskById
  };
}
