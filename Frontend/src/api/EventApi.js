import api from "./api";

// ⭐ Create Local Event
export const CreateEvent = async (event) => {
    try {
        const response = await api.post("/events", event);
        return response.data;
    } catch (error) {
        console.error("Create event error:", error.response?.data || error.message);
        throw error;
    }
};


// ⭐ GET ALL LOCAL EVENTS
export const GetAllevents = async () => {
    try {
        const response = await api.get("/events");
        return response.data;
    } catch (error) {
        console.error("get events error:", error.response?.data || error.message);
        throw error;
    }
};

// ⭐ GET LOCAL EVENT BY ID
export const GetEventById = async (id) => {
    try {
        const response = await api.get(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Get event error:", error.response?.data || error.message);
        throw error;
    }
};

// ⭐ DELETE LOCAL EVENT
export const DeleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        throw error;
    }
};

// ⭐ UPDATE LOCAL EVENT
export const UpdateEvent = async (id, updatedEvent) => {
    try {
        const response = await api.put(`/events/${id}`, updatedEvent, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        throw error;
    }
};
