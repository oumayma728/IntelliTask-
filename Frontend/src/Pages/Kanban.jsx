import KanbanBoard from "../Components/KanbanBoard";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Task() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto p-4">

          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
