import { useState } from "react";
import {login} from "../api/AuthApi";
import {useAuth} from "../Context/AuthContext"
import { useNavigate } from "react-router-dom"; // ✅ useNavigate instead of Navigate
export default function Login (){
    const [email, SetEmail] = useState("");
    const [password , SetPassword] = useState("");
    //useAuth() returns values/functions from your authentication context.
    const { setUser, setToken, setMode } = useAuth();
    const navigate = useNavigate(); 

const handleSubmit =async(e)=>{
    //stops the form from refreshing the whole page
    e.preventDefault();
    try{
        const data = await login (email, password);
        if (!data || !data.token) {
        alert("Login failed: No token received");
        return;
    }
    console.log("API response:", data);

        //updates context with the token.
        setToken(data.token);
        //saves the logged-in user’s details in context.
setUser({ email: data.email, username: data.username });
        //sets user’s role
        setMode(data.mode);    
        //saves the token in the browser so the user stays logged in even after refresh.
        localStorage.setItem("token", data.token);
        if (data.mode === "Personal") {
            console.log("Navigating to PersonalDashboard");
            navigate("/PersonalDashboard");
        } else {
            console.log("Navigating to TeamDashboard");
            navigate("/TeamDashboard");
        }
        alert("login successful")
        
    }
    catch (err)
    {
        alert("Login failed")
    }
};
return (
    <form onSubmit={handleSubmit}>
        <input value={email} onChange={e=>SetEmail(e.target.value)} placeholder="Email"></input>
        <input type="password"  value={password} onChange={e=>SetPassword(e.target.value)} placeholder="Password"></input>
        <button type="submit">Login</button>
    </form>
);
}
