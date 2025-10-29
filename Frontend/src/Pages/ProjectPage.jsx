import { useEffect, useState } from "react";
import useProjects from "../hooks/useProjects";
import Tasks from "../Components/TaskList";
import { UpdateProject } from "../api/ProjectApi";
export default function ProjectPage(){
    const {fetchProjects , CreateProject,deleteProject}=useProjects();
    const [projects ,setProjects]=useState([]);
    useEffect(()=>
    {fetchProjects();
    },[fetchProjects]);
    const handleAdd =async ()=>{
        const newProject ={name:"New Project",Tasks:[]};
        const created = await CreateProject(newProject);
        setProjects((prev)=>[...prev,created]);
    };
    const handleDelete = async(id)=>{
        await deleteProject(id);
        setProjects((prev)=> prev.filter((p)=>p.id !== id));
    }
    const handleRename = async (id)=>{
        const updated ={name :"Renamed project"};
        const result =await UpdateProject (id, updated);
        setProjects((prev)=>
        prev.map((p)=>(p.id ===id ? result:p))
        )
    }
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
            Add Project
        </button>
              {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 p-4 rounded-lg mb-4 shadow"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{project.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleRename(project.id)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

</div>
        </div>
    )
}