import api from "./api";
export const CreateEvent = async (event) => {
    try {
        const response = await api.post("http://localhost:5000/api/events", event);
        console.log('event created successfully', response.data);
        return response.data;
    } catch(error) {
        console.error("Create event error:", error.response?.data || error.message);
        console.error("Response status:", error.response?.status);
        throw error;
    }
}
export const GetAllevents =async()=>{
    try{
        console.log("test")
        const response = await api.get("http://localhost:5000/api/events")
        console.log(response)
        return response.data
    }catch(error)
    {
        console.error("Get all events error:",error.response?.data || error.message);
        throw error;
}}
export const GetEventById = async(id)=>{
    try{
        const response = await api.get(`http://localhost:5000/api/events/${id}`)
        return response.data
    }catch(error)
    {
        console.error("Get event error",error.response?.data || error.message);
        throw error;

    }
}
export const DeleteEvent =async(Id)=>{
    try{
        console.log("Deleting event with ID:", Id);
        const response =await api.delete(`http://localhost:5000/api/events/${Id}`)
 console.log("Delete response:", response.data);
        return response.data
    }catch(error)
    {
        console.error("Delete error",error.response?.data || error.message);
        throw error;

    }
}
export const UpdateEvent = async(id,updatedEvent) =>
{
    try{
        const response =await api.put(`http://localhost:5000/api/events/${id}`,{event :updatedEvent});
        return response.data
    }catch(error)
    {
        console.error("Update error",error.response?.data || error.message);
        throw error;
    }
}