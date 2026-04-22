import { useEffect, useState } from "react";
import { create, getAll, patch, remove, update, } from "../api/tasks";
import { Priority, type TaskRequestDTO, type TaskResponseDTO } from "../types";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState<TaskResponseDTO[]>([]);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [priority, setPriority] = useState<Priority>(Priority.low)
    const [filterDate, setFilterDate] = useState("")

    // FOR UPDATE
    const [editingTask, setEditingTask] = useState<TaskResponseDTO | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editDueDate, setEditDueDate] = useState("")
    const [editPriority, setEditPriority] = useState<Priority>(Priority.low)

    // ERRORS
    const [createErrors, setCreateErrors] = useState<{
        title?: string,
        description?: string,
        dueDate?: string
    }>({});
    const navigate = useNavigate();

    //----------- FILTER TASKS ----------- 
    const filteredTasks = filterDate
        ? tasks.filter(t => new Date(t.dueDate).toISOString().split('T')[0] === filterDate)
        : tasks;

    //----------- LOAD TASKS ----------- 
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getAll();
                setTasks(data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            }
        }
        fetchTasks();
    }, []);

    //----------- DELETE ----------- 
    const handleDelete = async (id: number) => {
        await remove(id);
        setTasks(tasks.filter(t => t.id !== id));
    }

    //----------- PATCH ----------- 
    const handlePatch = async (id: number) => {
        await patch(id);
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ));
    }

    //----------- CREATE ----------- 
    const handleCreate = async () => {
        const newErrors: { title?: string, description?: string, dueDate?: string } = {};

        if (!title) {
            newErrors.title = "Title is required"
        } else if (title.length > 255) {
            newErrors.title = "Title length can't be more 255 characters"
        }

        if (description.length > 2048) {
            newErrors.description = "Description length can't be more 2048 characters"
        }

        if (!dueDate) {
            newErrors.dueDate = "Due date is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setCreateErrors(newErrors);
            return;
        }


        const model: TaskRequestDTO = {
            title,
            description,
            dueDate,
            priority
        }

        try {
            await create(model);
            const data = await getAll();
            setTasks(data);
            setTitle("");
            setDescription("");
            setDueDate("");
            setPriority(Priority.low);
            setCreateErrors({});
        } catch (error) {
            console.error("Ошибка при создании задачи", error)
        }
    }

    //----------- UPDATE ----------- 
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;

        const model: TaskRequestDTO = {
            title: editTitle,
            description: editDescription,
            dueDate: editDueDate,
            priority: editPriority
        };

        try {
            await update(editingTask.id, model);

            const updatedTasks = await getAll();
            setTasks(updatedTasks);

            setEditingTask(null);
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
    }


    return (
        <div className="bg-gray-950 min-h-screen">

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* py-8 даёт отступ сверху от хедера и снизу */}

                {/* ------------ CREATE FORM ------------ */}
                <div className="w-full bg-gray-900 flex flex-col gap-3 p-6 rounded-2xl mb-6">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {createErrors.title && <p className="text-red-400 text-xs">{createErrors.title}</p>}

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {createErrors.description && <p className="text-red-400 text-xs">{createErrors.description}</p>}

                    <input
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        type="date"
                        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {createErrors.dueDate && <p className="text-red-400 text-xs">{createErrors.dueDate}</p>}

                    <div className="flex items-center gap-3">
                        <label className="text-gray-400 text-sm w-16">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={Priority.low}>Low</option>
                            <option value={Priority.middle}>Middle</option>
                            <option value={Priority.high}>High</option>
                        </select>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all cursor-pointer"
                    >
                        Create
                    </button>
                </div>

                {/* ------------ FILTER ------------ */}
                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate("")}
                            className="text-sm text-gray-400 hover:text-white transition-colors underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* ------------ ALL TASKS ------------ */}
                <div className="flex flex-col gap-3">
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`w-2 h-2 rounded-full  ${task.priority === Priority.high ? 'bg-red-500' :
                                    task.priority === Priority.middle ? 'bg-yellow-400' :
                                        'bg-green-400'
                                    }`} />
                                <h3 className="text-white font-medium truncate">{task.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full  ${task.isCompleted
                                    ? 'bg-green-900 text-green-400'
                                    : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    {task.isCompleted ? 'Done' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 ">
                                <button
                                    onClick={() => handlePatch(task.id)}
                                    className="text-xs border border-gray-700 text-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-800 transition-colors"
                                >
                                    {task.isCompleted ? 'Undo' : 'Complete'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingTask(task);
                                        setEditTitle(task.title);
                                        setEditDescription(task.description);
                                        setEditDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
                                        setEditPriority(task.priority);
                                    }}
                                    className="text-xs border border-gray-700 text-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-800 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-xs border border-red-900 text-red-400 rounded-lg px-3 py-1.5 hover:bg-red-950 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ------------ UPDATE MODAL ------------ */}
                {editingTask !== null && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
                            <h2 className="text-white text-lg font-semibold">Edit Task</h2>
                            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={Priority.low}>Low</option>
                                    <option value={Priority.middle}>Middle</option>
                                    <option value={Priority.high}>High</option>
                                </select>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTask(null)}
                                        className="flex-1 border border-gray-700 text-gray-300 text-sm rounded-lg py-2.5 hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Tasks;