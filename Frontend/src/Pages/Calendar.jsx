import MyCalendar from '../Components/Calendar'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
export default function Calendar(){
    return(
    <div>
        <div className=" bg-gray-900 text-white flex flex-col">
              <Navbar />
              {/* Main content area */}
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-auto">
                  <MyCalendar />
                </div>
              </div>
            </div>
    </div>)
}