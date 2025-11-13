import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";

const TaskCard = ({
    task,
    editingTask,
    setEditingTask,
    deleteTask,
    updateTask,
    addTask,
    fetchTasks,
    updatingTaskId,
    columns
}) => {

    const handleSave = async (task) => {
        if (task.isNew) {
            try {
                const savedTask = await addTask({
                    Title: task.Title,
                    Description: task.Description,
                    DueDate: task.DueDate,
                    ProjectName: task.ProjectName,
                    Status: task.Status,
                });
                if (savedTask?.Id) {
                    setEditingTask(null);
                    await fetchTasks();
                }
            } catch {
                alert("Please fill all required fields correctly");
            }
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateTask(task.Id, { ...task, Status: newStatus });
            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return "Invalid date";
        }
    };

    if (editingTask && editingTask.Id === task.Id) {
        return (
            <div className="space-y-2 bg-gray-700 p-3 rounded-lg mb-3 border-2 border-yellow-400">
                <input
                    type="text"
                    value={task.Title || ""}
                    onChange={(e) => setEditingTask({ ...task, Title: e.target.value })}
                    className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                    placeholder="Title *"
                />
                <input
                    type="text"
                    value={task.Description || ""}
                    onChange={(e) => setEditingTask({ ...task, Description: e.target.value })}
                    className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                    placeholder="Description"
                />
                <input
                    type="date"
                    value={task.DueDate || ""}
                    onChange={(e) => setEditingTask({ ...task, DueDate: e.target.value })}
                    className="bg-gray-600 text-white px-2 py-1 rounded border border-gray-500"
                />
                <input
                    type="text"
                    value={task.ProjectName || ""}
                    onChange={(e) => setEditingTask({ ...task, ProjectName: e.target.value })}
                    className="bg-gray-600 text-white px-2 py-1 rounded w-full border border-gray-500"
                    placeholder="Project Name *"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSave(task)}
                        className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm flex-1"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            draggable={!task.isNew && updatingTaskId !== task.Id}
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.Id)}
            className={`bg-gray-700 p-3 rounded-lg mb-3 cursor-move hover:bg-gray-600 transition relative ${updatingTaskId === task.Id ? "opacity-50" : ""}`}
        >
            {updatingTaskId === task.Id && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <FaSpinner className="animate-spin text-blue-500" />
                </div>
            )}

            {/* Task Header */}
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{task.Title || "Untitled"}</h4>
                {task.ProjectName && <span className="bg-gray-600 text-xs px-2 py-1 rounded">{task.ProjectName}</span>}
            </div>

            {/* Task Description */}
            <p className="text-gray-300 text-sm mb-2">{task.Description || "No description"}</p>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                <span>{formatDate(task.DueDate)}</span>
                <div className="flex gap-2">
                    <button onClick={() => setEditingTask(task)} className="text-blue-400 hover:text-blue-300" disabled={updatingTaskId === task.Id}>
                        <FaEdit />
                    </button>
                    <button onClick={() => deleteTask(task.Id)} className="text-red-400 hover:text-red-300" disabled={updatingTaskId === task.Id}>
                        <FaTrash />
                    </button>
                </div>
            </div>

            {/* Status Buttons */}
            <div className="flex gap-1 mt-2">
                {columns.map(
                    (col) =>
                        col.id !== task.Status && (
                            <button
                                key={col.id}
                                onClick={() => handleStatusChange(col.id)}
                                disabled={updatingTaskId === task.Id}
                                className={`text-xs px-2 py-1 rounded flex-1 ${col.id === "In Progress"
                                        ? "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800"
                                        : col.id === "To Do"
                                            ? "bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800"
                                            : "bg-green-600 hover:bg-green-500 disabled:bg-green-800"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Move to {col.title}
                            </button>
                        )
                )}
            </div>
        </div>
    );
};

export default TaskCard;
