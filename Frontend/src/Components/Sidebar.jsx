import { useState } from "react";
import logo from "../logo-Photoroom.png"
import { useAuth } from "../Context/AuthContext";
import { MdOutlineMenuOpen } from "react-icons/md";
import { FaHome, FaTasks, FaProjectDiagram, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export function Sidebar(){
    const { mode ,user} = useAuth(); 

    const[open,setOpen]=useState(true);
    const menuItems =[
        {
        icon:<FaHome size={20}/>,
        label:'Home'
    },
    {
        icon:<FaTasks size={20}/>,
        label:'Tasks'
    },
    {
        icon:<FaProjectDiagram size={20}/>,
        label:'Projects'
    },
    {
        icon:<FaCalendarAlt size={20}/>,
        label:'Calendar'
    },
    {
        icon:<FaCog size={20}/>,
        label:'Settings'
    },
    {
        icon:<FaSignOutAlt size={20}/>,
        label:'Logout'
    },
]
if (mode==="team")
{
        menuItems.splice(4, 0, { icon: <FaUsers size={20} />, label: 'Team / Users' }); // insert before Settings

}
    return(
        
        <nav className={`shadow-md h-screen w-60 bg-gray-800 p-2 flex flex-col transition-all  duration-300 ${open? 'w-60':'w-20'} flex flex-com`}>
            {/*Header*/}
            <div className="flex items-center border-b border-gray-600 pb-2 mb-7">

            <img src={logo} className={`transition-all duration-300 ${open ? 'w-10':'w-0'} rounded-md`}/>
            <MdOutlineMenuOpen size={30} className={`duration-500 cursor-pointer ${!open && 'rotate-180'}`} onClick={()=>setOpen(!open)}/>
            </div>
            {/*Body*/}


        <ul className="flex-grow">
        {menuItems.map((item, index) => (
            <li key={index} className="group relative px-3 py-2 hover:bg-blue-700 rounded-md duration-300 cursor-pointer flex gap-3">
            <div>{item.icon}</div>
  <p className={`${open ? 'inline-block' : 'hidden'} transition-all duration-300`}>
                {item.label}
            </p>
            {!open && (
    <span className="absolute left-12 text-white rounded-md px-4 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                {item.label}</span>)}
        
            </li>
        ))}
        </ul>
        {/*Footer*/}
        <div className="px-3 py-2 border-t border-gray-600">
            <FaUserCircle size={30}/>
            <div className={`leading-5${!open && 'w-0 translate-x-24'}`}>
                <p >{user?.username}</p>
                <span className="text-xs">{user?.email}</span>
            </div>
        </div>
        </nav>

    );
}