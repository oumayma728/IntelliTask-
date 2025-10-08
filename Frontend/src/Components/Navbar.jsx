import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
export default function Navbar(){
    const [showNotifications , setShowNotifications]=useState(false);
const{user} =useAuth();

console.log("User from context:", user);

console.log("User name:", user?.token?.username);
    return(

        <nav className="bg-gray-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
            <ul className="flex items-center space-x-6">
                <li><a href="/" className="hover:text-blue-300 transition-colors duration-200 font-medium px-3 py-2 rounded-md">Home</a></li>
                <li className="relative">
                    <button onClick={()=>setShowNotifications(!showNotifications)}
                    className="hover:text-blue-300 transition-colors duration-200 font-medium px-3 py-2 rounded-md flex items-center gap-2">
                    Notifications
                    <svg 
                        className={`w-4 h-4 transition-transform ${showNotifications ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                {showNotifications && (
                    <div className="absolute mt-2 bg-white text-black p-3 rounded shadow-lg">
                    <p>No new notifications</p>
                    <p className="text-sm text-gray-500">Check back later!</p> 
                    </div>
                )}
                </li>
                <li><a href="/"  className="hover:text-blue-200">Invite members</a></li>
                <li><a href="/"  className="hover:text-blue-200">Search</a></li>
            </ul>
        <div className="flex items-center space-x-4">
        <span className="font-medium text-gray-200">{user?.username ||"Guest"}</span>
        <img
        src="" 
        alt="Profile"
        className="w-10 h-10 rounded-full"
        />
        </div>
    </div>
    </div>
        </nav>
    );
} 