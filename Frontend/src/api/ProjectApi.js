import api from "./api";
export const CreateProject = async (Project)=>{
    try{
        const response = await api.post("/Project")
    return response.data
    }catch (error)
    {
 if (process.env.NODE_ENV === "development") {
            console.error("Create Project error:", error.response?.data || error.message);
        }        throw error;
    }
}
export const GetAllProjects =async()=>{
    try{
        const response = await api.get("/Project")
        return response.data
    }catch(error)
    {
 if (process.env.NODE_ENV === "development") {
            console.error("Get all projects error:", error.response?.data || error.message);
        }        throw error;
}}
export const GetProjectById = async(id)=>{
    try{
        const response = await api.get(`/Project/${id}`)
        return response.data
    }catch(error)
    {
 if (process.env.NODE_ENV === "development") {
            console.error("Get project  error:", error.response?.data || error.message);
        }        throw error;

    }
}
export const DeleteProject =async(id)=>{
    try{
        const response =await api.delete(`/Project/${id}`)
        return response.data
    }catch(error)
    {
 if (process.env.NODE_ENV === "development") {
            console.error("delete error:", error.response?.data || error.message);
        }        throw error;

    }
}
export const UpdateProject = async(id,UpdateProject) =>
{
    try{
        const response =await api.put(`/Project/${id}`,{task :UpdateProject});
        return response.data
    }catch(error)
    {
 if (process.env.NODE_ENV === "development") {
            console.error(" Update error:", error.response?.data || error.message);
        }        throw error;
    }
}