import Navbar from "../Components/Navbar"
import { Sidebar } from "../Components/Sidebar"
import Task from "../Pages/Task"
export default function PersonalDashboard(){
    return(
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Navbar/>
        <div className="flex flex-1">
        <Sidebar/>
        <Task/>
        </div>
        </div>
    )
}