import { createContext, useContext, useState } from "react";
//This creates an empty context box
const AuthContext= createContext();
export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const[token,setToken]=useState(null);
    const [mode,setMode]=useState(null);
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