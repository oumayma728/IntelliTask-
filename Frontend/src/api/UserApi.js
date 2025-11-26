import api from "./api";

export const GetAllUsers = async () => {
    try {
        const response = await api.get(`/User`,{
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserById = async (id) => {
    try{
        const response = await api.get(`/User/${id}`, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    }catch (error) {
        console.error("Get user error:", error.response?.data || error.message);
        throw error;
    }
};
export const updateUser = async (id, updatedUser) => {
    try {
        const response = await api.put(`/User/${id}`, updatedUser, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        throw error;
    }
};


