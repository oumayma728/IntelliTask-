import { useState } from "react";
import {login} from "../api/AuthApi";
import {useAuth} from "../Context/AuthContext"
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate instead of Navigate
import register from "./Register";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
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
const login =useGoogleLogin({
    onSuccess:credentialResponse =>{
        console.log(credentialResponse);
// Decode the JWT credential
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google token:", decoded);    },
    onError :()=>console.log("Login failed")
})
return (
    <div className="flex gap-4 items-center p-8 justify-center min-h-screen bg-gray-800">
    <div className="bg-gray-800 backdrop-blur-md border border-white/600 p-8 rounded-2xl shadow-lg w-full max-w-md ">
    <h2 className="text-2xl font-bold mb-6 text-center text-white ">Login</h2>
<button 
  onClick={login}
  className="flex items-center justify-center gap-5 bg-white text-gray-600 font-semibold px-5 py-5 rounded-md border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 w-full"
>
  <img 
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
    alt="Google" 
    className="w-5 h-5"
  />
  Sign in with Google
</button>
    <form className="flex flex-col gap-5"onSubmit={handleSubmit}>
        <input value={email} 
        onChange={e=>SetEmail(e.target.value)} 
        placeholder="Email"
        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
        ></input>
        <input type="password"
        value={password}
        onChange={e=>SetPassword(e.target.value)} 
        placeholder="Password"
        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"></input>
        <button type="submit" className=" w-full bg-white text-purple-600 font-semibold  py-3 rounded-xl hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300 mt-6">Login</button>
        <p className="text-center text-white/70 text-sm mt-6">
        <Link to="/register">
        Already have an account
        </Link></p>
    </form></div></div>
);
}
