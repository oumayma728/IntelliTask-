import api from "./api";
export const CreateTask = async (task) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Token exists:", !!token);
        console.log("Token value:", token);
        
        const response = await api.post("http://localhost:5000/api/tasks", task);
        console.log('Task created successfully', response.data);
        return response.data;
    } catch(error) {
        console.error("Create Task error:", error.response?.data || error.message);
        console.error("Response status:", error.response?.status);
        throw error;
    }
}
export const GetAllTasks =async()=>{
    try{
        console.log("test")
        const response = await api.get("http://localhost:5000/api/tasks")
        console.log(response)
        return response.data
    }catch(error)
    {
        console.error("Get all tasks error:",error.response?.data || error.message);
        throw error;
}}
export const GetTaskById = async(id)=>{
    try{
        const response = await api.get(`http://localhost:5000/api/tasks/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Get task error",error.response?.data || error.message);
        throw error;

    }
}
export const DeleteTask =async(Id)=>{
    try{
        console.log("Deleting task with ID:", Id);
        const response =await api.delete(`http://localhost:5000/api/tasks/${Id}`)
 console.log("Delete response:", response.data);
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