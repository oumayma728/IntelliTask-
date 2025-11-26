import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data; // { token, mode, email, username }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(" login error:", error.response?.data || error.message);
    } throw error;
  }
};

export const register = async (email, password, mode = "personal") => {
  try {
    const response = await api.post("/auth/register", { email, password, mode });
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const errorMessage = Array.isArray(data)
      ? data.map(e => e.description).join("\n")
      : data?.message || "Unknown error";
    alert(errorMessage);
    if (process.env.NODE_ENV === "development") {
      console.error(" Register Error:", errorMessage);
    } throw error;
  }
};
export const ChangePassword = async (userId, currentPassword, newPassword) => {
  try{
    const response = await api.post("/auth/ChangePassword", { userId, currentPassword, newPassword });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(" Change Password Error:", error.response?.data || error.message);
    } throw error;    
  }
};
