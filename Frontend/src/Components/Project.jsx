import { useState, useEffect } from "react";
import useTasks from "../hooks/useTasks"; // assuming tasks contain ProjectName
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Projects() {
  const { tasks, fetchTasks } = useTasks();
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by ProjectName
  const groupedProjects = tasks.reduce((acc, task) => {
    if (!acc[task.ProjectName]) acc[task.ProjectName] = [];
    acc[task.ProjectName].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-semibold mb-6">Projects</h2>

      {Object.keys(groupedProjects).length === 0 && (
        <p className="text-gray-400">No projects found.</p>
      )}

      {Object.entries(groupedProjects).map(([projectName, projectTasks]) => (
        <div key={projectName} className="mb-4 border border-gray-700 rounded-lg">
          <div
            className="flex justify-between items-center bg-gray-800 px-4 py-3 cursor-pointer hover:bg-gray-700 transition"
            onClick={() =>
              setExpandedProject(expandedProject === projectName ? null : projectName)
            }
          >
            <h3 className="text-xl font-semibold">{projectName}</h3>
            {expandedProject === projectName ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedProject === projectName && (
            <div className="bg-gray-850 p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.map((task) => (
                    <tr
                      key={task.Id}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="p-2">{task.Title}</td>
                      <td className="p-2">{task.Status}</td>
                      <td className="p-2">{new Date(task.DueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
