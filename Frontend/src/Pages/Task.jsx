import TaskList from "../Components/TaskList"
import TaskToolbar from "../Components/TaskToolbar"

export default function Task() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
              <div className="flex-1 overflow-auto">
        <TaskList />
      </div>
    </div>
  );
}
