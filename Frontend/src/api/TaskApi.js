import api from "./api";
export const  CreateTask = async (task) => {
    try {
        const response = await api.post("/tasks", task);
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Create Task error:", error.response?.data || error.message);
        }

        throw error;
    }
}
export const  GetAllTasks = async () => {
    try {
        const response = await api.get("tasks")
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Get task error:", error.response?.data || error.message);
        } throw error;
    }
}
export const  GetTaskById = async (id) => {
    try {
        const response = await api.get(`/tasks/${id}`)
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Get task error:", error.response?.data || error.message);
        } throw error;

    }
}
export const DeleteTask = async (id) => {
    try {
        const response = await api.delete(`/tasks/${id}`)
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Delete error:", error.response?.data || error.message);
        } throw error;

    }
}
export const UpdateTask = async (id, updatedTask) => {
    try {
        const response = await api.put(`/tasks/${id}`, updatedTask);
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Update error:", error.response?.data || error.message);
        } throw error;
    }
};

