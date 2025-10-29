import { useState } from "react";
import logo from "../logo-Photoroom.png";
import { useAuth } from "../Context/AuthContext";
import { MdOutlineMenuOpen } from "react-icons/md";
import { 
  FaHome, FaTasks, FaProjectDiagram, FaCalendarAlt, 
  FaUsers, FaCog, FaSignOutAlt, FaUserCircle 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function Sidebar() {
  const { mode, user } = useAuth();
  const [open, setOpen] = useState(true);
const location = useLocation();
  const menuItems = [
    { icon: <FaHome size={20} />, label: 'Home' ,path:'/'},
    { icon: <FaTasks size={20} />, label: 'Tasks' ,path:'/Task'},
    { icon: <FaCalendarAlt size={20} />, label: 'Calendar' , path:'/Calendar' },
    { icon: <FaCog size={20} />, label: 'Settings' },
    { icon: <FaSignOutAlt size={20} />, label: 'Logout' },
  ];

  if (mode === "team") {
    menuItems.splice(4, 0, { icon: <FaUsers size={20} />, label: "Team / Users" });
  }

  return (
    <nav
      className={`shadow-md bg-gray-800 p-2 flex flex-col transition-all duration-300
        ${open ? 'w-60' : 'w-20'} 
        h-[calc(100vh-64px)] overflow-y-auto`}
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
  className="group relative flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer duration-300"
>
  <Link to={item.path} className="flex items-center gap-3 w-full">
    <div className="text-white">{item.icon}</div>
    <p
      className={`text-white text-sm whitespace-nowrap transition-all duration-300 ${
        open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 hidden"
      }`}
    >
      {item.label}
    </p>
  </Link>
            {!open && (
             <div className="absolute left-16 bg-gray-900 text-white text-sm px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
      {item.label}
    </div>

            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center gap-3 px-3 py-3 border-t border-white/30">
  <FaUserCircle size={30} className="text-white" />
  <div className={`transition-all duration-300 overflow-hidden text-gray-100 ${open ? 'opacity-100' : 'opacity-0 w-0'}`}>
    <p className="font-medium">{user?.username}</p>
    <span className="text-xs text-gray-200">{user?.email}</span>
  </div>
</div>

    </nav>
  );
}
