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
      setTasks((prev) => prev.filter((t) => t.Id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };
  //update task
  const updateTask = async (taskId, updatedTask) => {
    try {
      // Find the current task to get all required fields
      const currentTask = tasks.find(task => task.Id === taskId);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Merge with current task to ensure all fields are present
      const fullUpdatedTask = { ...currentTask, ...updatedTask };

      // Debug: Check if all required fields have values
      console.log('Full task data being sent:', fullUpdatedTask);
      console.log('Field check:', {
        Title: fullUpdatedTask.Title,
        Description: fullUpdatedTask.Description,
        ProjectName: fullUpdatedTask.ProjectName,
        Status: fullUpdatedTask.Status
      });

      const response = await UpdateTask(taskId, fullUpdatedTask);

      setTasks(prev => prev.map(task =>
        task.Id === taskId ? { ...task, ...updatedTask } : task
      ));
      return response;

    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message);
      throw error;
    }
  };
  return {
  tasks,
  isLoading,
  error,
  fetchTasks,
  addTask,
  deleteTask,
  updateTask
};

}
