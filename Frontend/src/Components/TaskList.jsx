import { useEffect, useState } from "react";
import { FaTable } from "react-icons/fa";
import useTasks from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const { tasks, fetchTasks, addTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksState, setTasksState] = useState([]);
  const [projectsState, setProjectsState] = useState([]);//used when adding new projects

  const [editingRow, setEditingRow] = useState(null); //keeps track of which task is being edited
  const [statusFilter, setStatusFilter] = useState("all"); //stores the selected filter
  //tracks which projects are open or closed

  const [ExpandedProjects, setExpandedProjects] = useState({});
  const navigate = useNavigate();
  //fetches tasks
  useEffect(() => {
    console.log("Fetching tasks...");
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    //Update the local tasks state with the fetched tasks
    setTasksState(tasks);
    //Get all unique project names from tasks
    const projects = [...new Set(tasks.map(task => task.ProjectName))];
    //create empty object to stre projects 
    const initialExpanded = {};
    //Set all projects to be expanded (open) by default
    projects.forEach(project => {
      initialExpanded[project] = true;
    })
    setExpandedProjects(initialExpanded);
  }, [tasks]);
  //Groups tasks by their project name
  const groupTasksByProject = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
      const projectName = task.ProjectName || "Uncategorized";
      if (!grouped[projectName]) {
        grouped[projectName] = [];
      }
      grouped[projectName].push(task);
    });
    return grouped;
  }
  const toggleProject = (projectName) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectName]: !prev[projectName]
    }));
  };
  const toggleAllProjects = () => {
    const allExpanded = Object.values(ExpandedProjects).every(val => val);
    const newExpanded = {};
    Object.keys(ExpandedProjects).forEach(project => {
      newExpanded[project] = !allExpanded;
    });
    setExpandedProjects(newExpanded);
  };




  const handleNewTask = () => {
    const newTask = {
      Id: Date.now(),
      Title: "",
      Description: "",
      DueDate: "",
      ProjectName: "",
      Status: "ToDo",
      isNew: true
    };
    setTasksState([newTask, ...tasksState]);
    setEditingRow(newTask.Id);
  };
  const handleNewProject = () => {
    const newProjectTask = {
      Id: `project-${Date.now()}`,
      Title: "New Project",
      Description: "",
      DueDate: "",
      ProjectName: "New Project",
      Status: "ToDo",
      isNew: true,
      isProjectHeader: true
    };
    setProjectsState([newProjectTask, ...projectsState]);
    setEditingRow(newProjectTask.Id);
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

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "ToDo": return "To Do";
      case "InProgress": return "In Progress";
      case "Done": return "Done";

      default: return status;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "ToDo": return "bg-blue-600";
      case "InProgress": return "bg-yellow-600";
      case "Done": return "bg-green-600";
      default: return "bg-gray-600";
    }
  };




  const filteredTasks = tasksState.filter((task) => {
    console.log(task.Status, statusFilter);
    const matchesStatus = statusFilter === "all" || task.Status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (task.Title && task.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.Description && task.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.ProjectName && task.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
  const groupedTasks = groupTasksByProject(filteredTasks);

  return (
    <div className="min-h-screen flex flex-col justify-start p-8">
      {/* ADDED bg-white dark:bg-gray-900 to ensure the header background is correct */}
      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-8 pt-6 pb-2">
          {/* ADDED theme-aware text color */}
          <h2 className="text-3xl font-semibold tracking-wIde text-gray-900 dark:text-white">Tasks</h2>
        </div>

        <div className="flex items-center px-8 space-x-8 border-b border-gray-300 dark:border-gray-700 pb-2">
          {/* ADDED theme-aware text color for buttons */}
          <button className="border-b-2 border-blue-500 pb-2 font-medium text-gray-900 dark:text-white">Table</button>
          <button onClick={() => navigate("/KanbanBoard")} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Kanban</button>
          <button onClick={() => navigate("/Calendar")} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Calendar</button>
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white pb-2 text-xl font-bold">+</button>
        </div>

        <div className="flex items-center justify-between px-8 py-3 border-t border-gray-300 dark:border-gray-700 mt-2">
          <div className="flex items-center gap-3">
            {/* Buttons are fine as they use hard-coded colors (blue/red) which is common for actions */}
            <button
              onClick={handleNewTask}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition"
            >
              <FaTable /> New Task
            </button>
            <button
              onClick={handleNewProject}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-medium transition"
            >
              <FaTable /> New Project
            </button>
            {/* Input field theme fix */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {/* Select field theme fix */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="To Do">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>
      </nav>

      <table className="w-full border-collapse">
        <thead>
          {/* Table header border and text color fix */}
          <tr className="border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through projects */}

          {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
            <>
              {/* Project Header Row - text color fix */}
              <tr
                key={`project-${projectName}`}
                className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => toggleProject(projectName)}
              >
                <td colSpan="6" className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {ExpandedProjects[projectName] ? (
                      <span>▼</span>
                    ) : (
                      <span>▶</span>
                    )}
                    <span className="font-semibold">{projectName}</span>
                    {/* Text color fix for task count */}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">({projectTasks.length} tasks)</span>
                  </div>
                </td>
              </tr>

              {/* Project Tasks - only show if expanded */}
              {ExpandedProjects[projectName] && projectTasks.map((task) => (
                <tr key={task.Id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-4 py-2">
                    {editingRow === task.Id ? (
                      <input
                        type="text"
                        value={task.Title || ""}
                        onChange={(e) => handleChange(task.Id, "Title", e.target.value)}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded w-full border border-gray-300 dark:border-gray-600"
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
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded w-full border border-gray-300 dark:border-gray-600"
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
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
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
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded w-full border border-gray-300 dark:border-gray-600"
                        placeholder="Enter project name *"
                      />
                    ) : (
                      task.ProjectName || "No project"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === task.Id ? (
                      <select
                        value={task.Status}
                        onChange={(e) => handleChange(task.Id, "Status", e.target.value)}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
                      >
                        <option value="ToDo">To Do</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(task.Status)}`}>
                        {getStatusDisplayText(task.Status)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingRow === task.Id ? (
                      <>
                        {/* Action buttons are fine as they use hard-coded colors (green/gray) which is common for actions */}
                        <button
                          onClick={() => handleSave(task)}
                          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(task.Id)}
                          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm text-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingRow(task.Id)}
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.Id)}
                          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm text-white"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ))}

          {filteredTasks.length === 0 && (
            <tr>
              {/* Text color fix for "No tasks found" message */}
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No tasks found. {searchTerm ? "Try changing your search." : "Create your first task!"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}