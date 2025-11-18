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
    columns
}) => {

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        const task = tasks.find(t => t.Id === taskId);
        if (!task) return;
        try {
            await updateTask(task.Id, { ...task, Status: column.id });
            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

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
