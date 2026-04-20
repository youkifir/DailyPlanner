import { useEffect, useState } from "react";
import { create, getAll, patch, remove, update, } from "../api/tasks";
import { Priority, type TaskRequestDTO, type TaskResponseDTO } from "../types";

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

    //----------- FILTER TASKS ----------- 
    const filteredTasks = filterDate
        ? tasks.filter(t => new Date(t.dueDate).toISOString().split('T')[0] === filterDate)
        : tasks;

    //----------- LOAD TASKS ----------- 
    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getAll();
            setTasks(data);
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
        <div>
            {/* ------------ CREATE FORM ------------ */}
            <div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <input
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    type="date"
                />
                <label htmlFor="priority">Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                >
                    <option value={Priority.low}>Low</option>
                    <option value={Priority.middle}>Middle</option>
                    <option value={Priority.high}>High</option>
                </select>
                <button
                    onClick={() =>
                        handleCreate()}>
                    Create
                </button>
            </div>

            {/* FILTER */}
            <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filter by date"
            />
            {filterDate && <button onClick={() => setFilterDate("")}>Clear</button>}

            {/* ------------ ALL TASKS ------------ */}
            {filteredTasks.map(task => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <div>
                        {task.isCompleted ? (
                            <p>Complete</p>
                        ) : (
                            <p>No complete</p>

                        )}
                    </div>
                    <button onClick={() => {
                        setEditingTask(task);
                        setEditTitle(task.title);
                        setEditDescription(task.description);
                        setEditDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
                        setEditPriority(task.priority);
                    }}>Update</button>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                    <button onClick={() => handlePatch(task.id)}>IsCompleted</button>
                </div>
            ))
            }

            {/* ------------ UPDATE MODAL WINDOW FORM ------------ */}
            {editingTask !== null && (
                <div>
                    <h2>Editing</h2>
                    <form onSubmit={handleUpdate}>
                        <label>Title</label>
                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <label>Description</label>
                        <input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <label>DueDate</label>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                        />

                        <label>Priority</label>
                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as Priority)}
                        >
                            <option value={Priority.low}>Low</option>
                            <option value={Priority.middle}>Middle</option>
                            <option value={Priority.high}>High</option>
                        </select>

                        <button type="submit">Save</button>
                    </form>
                    <button onClick={() => setEditingTask(null)}>Close</button>
                </div>
            )}
        </div >
    );
}

export default Tasks;