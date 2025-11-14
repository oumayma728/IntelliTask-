import MyCalendar from '../Components/Calendar'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
export default function Calendar() {
  return (
    <div>
      <div className="flex h-screen ">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />

          <div className="flex-1 flex flex-col overflow-auto">
            <MyCalendar />
          </div>
        </div>
      </div>
    </div>)
}