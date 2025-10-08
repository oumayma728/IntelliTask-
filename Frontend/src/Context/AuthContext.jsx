import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
//This creates an empty context box
const AuthContext= createContext();
export function AuthProvider({children}){
    const [user,setUser]=useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
    const [mode,setMode]=useState(null);
    useEffect (()=>{
        if (token) {
            try {
        const decoded =jwtDecode(token);
setUser({
  email: decoded.email,
  username: decoded.username || decoded.unique_name || decoded.name
});
      setMode(decoded.mode || null);
    } catch (err) {
      console.error("Failed to decode token", err);
      setUser(null);
            }
        }
    },[token]);
    return (
        // AuthContext.Provider = makes these values available to ALL components inside {children}
        <AuthContext.Provider value={{user ,setUser,token,setToken,mode,setMode}}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}