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
        <form onSubmit={handleSumbit}>
            <input value={email} onChange={e=>SetEmail(e.target.value)} placeholder="email"></input>
            <input value={password} type={password} onChange={e=>SetPassword(e.target.value)} placeholder="password" ></input>
            <select value={mode} onChange={e=>SetMode(e.target.value)} >
                <option value="Personal">Personal mode</option>
                <option value="Team">Team mode </option>
            </select>
            <button type="sumbit"> Register </button>
        </form>
    )
}