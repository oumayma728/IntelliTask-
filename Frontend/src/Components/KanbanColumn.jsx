import TaskCard from "./TaskCard";

const KanbanColumn = ({
    column,
    tasks,
    editingTask,
    setEditingTask,
    deleteTask,
    updateTask,
    addTask,
    fetchTasks,
    updatingTaskId,
    columns }) => {

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        let draggedTask = null; //create variable to hold dragged task

        try {
           // Try to get full task payload first 
            const raw = e.dataTransfer.getData("task");
            if (raw) {
                draggedTask = JSON.parse(raw);
            }
        } catch (err) {
            console.error("Failed to parse task JSON:", err);
        }

        // Fallback to taskId lookup if JSON not available
        if (!draggedTask) {
            const rawId = e.dataTransfer.getData("taskId");
            if (rawId) {
                const id = isNaN(Number(rawId)) ? rawId : Number(rawId);
                draggedTask = tasks.find(t => t.Id === id || String(t.Id) === String(id)) || null;
            }
        }

        if (!draggedTask) return;

        try {
            // Update the task's status to this column's id
            await updateTask(draggedTask.Id, { ...draggedTask, Status: column.id });
            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };
// Function to handle adding a new task
    const handleAddTask = () => {
        const newTask = {
            Id: Date.now(),
            Title: "",
            Description: "",
            DueDate: "",
            ProjectName: "",
            Status: column.id,
            isNew: true,
        };
        setEditingTask(newTask);
    };

    return (
        <div
            key={column.id}
            className="flex-1 min-w-80"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className={`${column.color} text-white p-3 rounded-t-lg flex justify-between items-center`}>
                <h3 className="font-semibold">{column.title}</h3>
                <span className="bg-black bg-opacity-30 px-2 py-1 rounded text-sm">{tasks.length}</span>
            </div>

            {/* Column Body */}
            <div className=" p-3 rounded-b-lg min-h-96">
                <div
                    onClick={handleAddTask}
                    className="text-center py-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors mb-3"
                >
                    + Add Task
                </div>

                {tasks.map((task) => (
                    <TaskCard
                        key={task.Id}
                        task={task}
                        editingTask={editingTask}
                        setEditingTask={setEditingTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        addTask={addTask}
                        fetchTasks={fetchTasks}
                        updatingTaskId={updatingTaskId}
                        columns={columns}
                    />
                ))}

                {tasks.length === 0 && !editingTask && (
                    <div className=" text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
