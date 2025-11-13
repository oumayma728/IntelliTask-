import api from "./api";
export const CreateEvent = async (event) => {
    try {
        const response = await api.post("/events", event);
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Create event error:", error.response?.data || error.message);
        }
        throw error;
    }
}
export const GetAllevents = async () => {
    try {
        const response = await api.get("/events")
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("get events error:", error.response?.data || error.message);
        } throw error;
    }
}
export const GetEventById = async (id) => {
    try {
        const response = await api.get(`/events/${id}`)
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Get event error:", error.response?.data || error.message);
        } throw error;

    }
}
export const DeleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`)
        return response.data
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Delete error:", error.response?.data || error.message);
        } throw error;

    }
}
export const UpdateEvent = async (id, updatedEvent) => {
    try {
        const response = await api.put(`/events/${id}`, updatedEvent, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Update error:", error.response?.data || error.message);
        }
        throw error;
    }
}
