import Navbar from "../Components/Navbar"
import { Sidebar } from "../Components/Sidebar"
export default function PersonalDashboard(){
    return(
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Navbar/>
        <div className="flex flex-1">
        <Sidebar/>
        <div className="items-center text-white rounded-2xl">Personal Dashboard</div></div></div>
    )
}