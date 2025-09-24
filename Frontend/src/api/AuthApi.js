import api from "./api";
//Login Function
export const login = async (Email, Password) =>{
    try{
        const response = await api.post("http://localhost:5000/api/auth/login" , {Email, Password});
        // response.data should contain { token, mode, email, username } from backend
        return response.data;
    }catch (error)
    {
        console.error("Login error:",error.response?.data || error.message);
        throw error;
    }
};
export const register =async (email ,password , mode="personal") =>{
    try{
        const response= await api.post("http://localhost:5000/api/auth/register" ,{email,password, mode});
        return response.data
    }catch (error)
    {
        //get error array from Axios
        const errors = error.response?.data || [{description:"Unknown error"}];
        //get error array from Axios
    const errorMessage = errors.map(e => e.description).join("\n");
    alert(errorMessage);

    console.error("Register error:", error.response?.data || error.message);
        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem("token");
};