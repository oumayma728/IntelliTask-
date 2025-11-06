import { useState } from "react";
import logo from "../logo-Photoroom.png";
import { useAuth } from "../Context/AuthContext";
import { MdOutlineMenuOpen } from "react-icons/md";
import { 
  FaHome, FaTasks, FaProjectDiagram, FaCalendarAlt, 
  FaUsers, FaCog, FaSignOutAlt, FaUserCircle 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation , useNavigate} from "react-router-dom";
import {logout} from "../api/AuthApi"

export default function Sidebar() {
  const { mode, user } = useAuth();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
const handleLogout = () => {
  logout();              // remove token from localStorage
  navigate("/login");    // redirect user to login page
};

const location = useLocation();
  const menuItems = [
    { icon: <FaHome size={20} />, label: 'Home' ,path:'/home'},
    { icon: <FaTasks size={20} />, label: 'Tasks' ,path:'/Task'},
    { icon: <FaCalendarAlt size={20} />, label: 'Calendar' , path:'/Calendar' },
    { icon: <FaCog size={20} />, label: 'Settings' },
    { icon: <FaSignOutAlt size={20} />, label: 'Logout'  ,action:"logout"},
  ];

  if (mode === "team") {
    menuItems.splice(4, 0, { icon: <FaUsers size={20} />, label: "Team / Users" });
  }

  return (
    <nav
      className={`
  bg-gray-900 
  text-white 
  shadow-xl 
  flex flex-col 
  justify-between
  transition-all duration-300 
  ${open ? 'w-64' : 'w-16'}
  h-screen 
  py-6 
  px-3 
  overflow-visible
  border-r border-gray-700
  no-scrollbar
`}
>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-5">
  <img
    src={logo}
    alt="Logo"
    className={`transition-all duration-300 ${open ? 'w-14 opacity-100' : 'w-0 opacity-0'} rounded-md`}
  />
  <MdOutlineMenuOpen
    size={28}
    className={`text-white duration-500 cursor-pointer ${!open && 'rotate-180'}`}
    onClick={() => setOpen(!open)}
  />
</div>


      {/* Menu Items */}
      <ul className="flex-grow">
        {menuItems.map((item, index) => (
          <li
  key={index}
  className={`
    group relative flex items-center gap-3 
    px-3 py-2 mb-1
    rounded-lg cursor-pointer  
    transition-all duration-200 
    ${location.pathname === item.path ? "bg-blue-600" : "hover:bg-gray-800"}
  `}
  onClick={()=>item.action ==="logout" && handleLogout()}
>

  <Link to={item.path} className="flex items-center gap-3 w-full">
    <div className="text-white">{item.icon}</div>
   <p
  className={`
    text-sm whitespace-nowrap transition-all duration-200
    ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
  `}
>
  {item.label}
</p>
  </Link>
 <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg 
    opacity-0 group-hover:opacity-100 pointer-events-none transition duration-300 z-50 whitespace-nowrap">
      {item.label}
    </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
<div
  className={`
    flex items-center gap-3 px-3 py-5 border-t border-gray-700 mb-16
    transition-all duration-300
    ${!open ? "justify-center" : ""}
    relative group
  `}
>
  <FaUserCircle size={open ? 30 : 24} className="shrink-0 text-gray-300" />
  <div className={`transition-all duration-300 overflow-hidden text-gray-100 ${open ? 'opacity-100' : 'opacity-0 w-0'}`}>
    <p className="font-medium">{user?.username}</p>
    <span className="text-xs text-gray-400">{user?.email}</span>
  </div>
  {!open && (
  <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg 
  opacity-0 group-hover:opacity-100 pointer-events-none transition duration-300 z-[9999] whitespace-nowrap">
    {user?.username}<br />{user?.email}
  </div>
)}

</div>

    </nav>
  );
}
