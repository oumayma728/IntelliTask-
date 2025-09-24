import api from "./api";
export const CreateTask = async (task)=>{
try{
    const response = await api.post("http://localhost:5000/api/task",{task});
    return response.data
}catch(error)
{
    console.error("Create Task error:",error.response?.data || error.message);
        throw error;
}
}
export const GetAllTasks =async()=>{
    try{
        const response = await api.get("http://localhost:5000/api/task")
        return response.data
    }catch(error)
    {
        console.error("Get all tasks error:",error.response?.data || error.message);
        throw error;
}}
export const GetTaskById = async(id)=>{
    try{
        const response = await api.get(`http://localhost:5000/api/task/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Get task error",error.response?.data || error.message);
        throw error;

    }
}
export const DeleteTask =async(id)=>{
    try{
        const response =await api.delete(`http://localhost:5000/api/task/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Delete error",error.response?.data || error.message);
        throw error;

    }
}
export const UpdateTask = async(id,updatedTask) =>
{
    try{
        const response =await api.put(`http://localhost:5000/api/task/${id}`,{task :updatedTask});
        return response.data
    }catch(error)
    {
        console.error("Update error",error.response?.data || error.message);
        throw error;
    }
}