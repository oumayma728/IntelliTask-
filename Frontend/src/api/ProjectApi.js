import api from "./api";
export const CreateProject = async (Project)=>{
    try{
        const response = await api.post("http://localhost:5000/api/Project")
    return response.data
    }catch (error)
    {
        console.error("Create Project error",error.response?.data || error.message);
        throw error;
    }
}
export const GetAllProjects =async()=>{
    try{
        const response = await api.get("http://localhost:5000/api/Project")
        return response.data
    }catch(error)
    {
        console.error("Get all tasks error:",error.response?.data || error.message);
        throw error;
}}
export const GetProjectById = async(id)=>{
    try{
        const response = await api.get(`http://localhost:5000/api/Project/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Get task error",error.response?.data || error.message);
        throw error;

    }
}
export const DeleteProject =async(id)=>{
    try{
        const response =await api.delete(`http://localhost:5000/api/Project/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Delete error",error.response?.data || error.message);
        throw error;

    }
}
export const UpdateProject = async(id,UpdateProject) =>
{
    try{
        const response =await api.put(`http://localhost:5000/api/Project/${id}`,{task :UpdateProject});
        return response.data
    }catch(error)
    {
        console.error("Update error",error.response?.data || error.message);
        throw error;
    }
}