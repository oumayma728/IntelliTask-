import { useState } from "react";
import { register } from "../api/AuthApi";
import {useAuth} from "../Context/AuthContext"
export default function Register(){
    const [email,SetEmail]=useState("");
    const [password,SetPassword]=useState("");
    const [mode,SetMode]=useState("Personal");
    const { setUser, setToken, setMode } = useAuth();

    const handleSumbit =async(e)=>{
        e.preventDefault(); 
        try{
            const data = await register (email, password);
                    //updates context with the token.
                    setToken(data.token);
                    //saves the logged-in user’s details in context.
                    setUser({ email: data.email, username: data.username });
                    //sets user’s role
                    SetMode(data.mode);    
                    //saves the token in the browser so the user stays logged in even after refresh.
                    localStorage.setItem("token", data.token);
        }
        catch (error)
        {
            alert("register failed")
        }
    
    }
    return(
        <div className="flex items-center p-8 justify-center min-h-screen bg-gray-800">
    <div className="bg-gray-800 backdrop-blur-md border border-white/600 p-8 rounded-2xl shadow-lg w-full max-w-md ">
    <h2 className="text-2xl font-bold mb-6 text-center text-white ">Register</h2>
        <form onSubmit={handleSumbit} className="flex flex-col gap-4">
            <input value={email} 
            onChange={e=>SetEmail(e.target.value)}
            placeholder="email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"

            ></input>
            <input value={password} 
            type={password} 
            onChange={e=>SetPassword(e.target.value)} 
            placeholder="password" 
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
            ></input>
            <select 
            value={mode} 
            onChange={e=>SetMode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
 >
                <option value="Personal" className="bg-gray-800 text-white">Personal mode</option>
                <option value="Team"  className="bg-gray-800 text-white">Team mode </option>
            </select>
            <button type="sumbit" className="w-full bg-white text-purple-600 font-semibold  py-3 rounded-xl hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300 mt-6"> Register </button>
        </form>
        </div></div>
    )
}