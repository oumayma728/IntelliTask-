import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import ChatBot from "./AiHelper";
import useTasks from "../hooks/useTasks";
export default function Navbar() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showChatBot, setShowChatBot] = useState(false);
    const [Notifications, setNotifications] = useState([]);

    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const { tasks, fetchTasks } = useTasks();
    useEffect(() => {
        fetchTasks(); // fetch tasks when component mounts
}, [fetchTasks]);

// Check deadlines whenever tasks change
useEffect(() => {
  const checkDeadlines = () => {
    const now = new Date();
    const upcoming = tasks
      .filter(task => !task.completed)
      .filter(task => {
        const due = new Date(task.dueDate);
        const diff = due - now;
        return diff > 0 && diff <= 60 * 60 * 1000; // 1 hour before
      })
      .map(task => ({ message: `Task "${task.title}" is due soon!` }));
    setNotifications(upcoming);
  };

  checkDeadlines();
  const interval = setInterval(checkDeadlines, 60 * 1000);
  return () => clearInterval(interval);
}, [tasks]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //for temporary image :const imageUrl = URL.createObjectURL(file);
            //setProfileImage(imageUrl);
            //localStorage.setItem("image",imageUrl)
            const reader = new FileReader();//browser tool to read files.
            reader.onload = () => { //runs after the conversion is done.
                const base64String = reader.result; // the image as a string
                setProfileImage(base64String);/// show it immediately
                localStorage.setItem("profileImage", base64String); //save it 
            };
            reader.readAsDataURL(file);//converts the file into a Base64 string.

        }

    };
    useEffect(() => {
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
    }, []);

    console.log("User from context:", user);

    console.log("User name:", user?.token?.username);
    return (

        <nav className="shadow-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <ul className="flex items-center space-x-6">
                        <li><a href="/" className="hover:text-blue-300 transition-colors duration-200 font-medium px-3 py-2 rounded-md">Home</a></li>
                        <li className="relative sticky">
                            <button onClick={() => setShowNotifications(!showNotifications)}
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
                                <div className="absolute mt-2 w-64 bg-white text-black p-3 rounded shadow-lg">
                                    {Notifications.length === 0 ? (
                                        <p>No new notifications</p>
                                    ) : (
                                        Notifications.map((n, idx) => (
                                            <div key={idx} className="border-b py-1">
                                                {n.message}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                        </li>
                        {/*<li><a href="/" className="hover:text-blue-200">Invite members</a></li>
                        <li><a href="/" className="hover:text-blue-200">Search</a></li>*/}
                    </ul>
                    <button
                        onClick={() => setShowChatBot(!showChatBot)}
                        className="px-3 py-1 rounded-md "
                    >
                        SideKick
                    </button>
                    {showChatBot && (
                        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 flex flex-col">
                            <ChatBot />
                            <button
                                className="self-end m-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => setShowChatBot(false)}
                            >
                                Close
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            console.log("Navbar button clicked. theme before:", theme);
                            toggleTheme();
                        }}
                        className={`p-2 rounded-full transition-colors 
        ${theme === "light" ? "hover:bg-gray-200 text-gray-700" : "hover:bg-gray-700 text-yellow-400"}`}
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="font-medium">{user?.username || "Guest"}</span>
                        <img
                            src={profileImage || "https://via.placeholder.com/40"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()} // use ref
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"></input>
                    </div>
                </div>
            </div>
        </nav>
    );
} 