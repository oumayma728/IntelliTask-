import { useCallback, useState } from "react";
import {
  CreateProject,
  GetAllProjects,
  UpdateProject,
  DeleteProject,
} from "../api/ProjectApi";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch all projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await GetAllProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Create a new project
  const createProject = async (projectData) => {
    try {
      const newProject = await CreateProject(projectData);
      setProjects((prev) => [...prev, newProject]);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Delete a project
  const deleteProject = async (projectId) => {
    try {
      await DeleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Update a project
  const updateProject = async (projectId, updatedProject) => {
    try {
      const updated = await UpdateProject(projectId, updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Return everything you want components to use
  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject,
  };
}
