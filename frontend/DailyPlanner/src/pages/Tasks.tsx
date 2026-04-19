import { useEffect, useState } from "react";
import { create, getAll, patch, remove, update, get } from "../api/tasks";
import { Priority, type TaskRequestDTO, type TaskResponseDTO } from "../types";

const Tasks = () => {
    const [tasks, setTasks] = useState<TaskResponseDTO[]>([]);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [priority, setPriority] = useState<Priority>(Priority.low)

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getAll();
            setTasks(data);
        }
        fetchTasks();
    }, []);

    const handleDelete = async (id: number) => {
        const response = await remove(id);
        setTasks(tasks.filter(t => t.id !== id));
        return response;
    }

    const handlePatch = async (id: number) => {
        const response = await patch(id);
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ));
        return response;
    }

    const handleCreate = async (title: string, description: string, dueDate: string, priority: Priority) => {
        const model = {
            title,
            description,
            dueDate,
            priority
        }
        const response = await create(model);
        const data = await getAll();
        setTasks(data);
        return response;
    }


    return (
        <div>
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
                        handleCreate(title, description, dueDate, priority)}>
                    Create
                </button>
            </div>
            {tasks.map(task => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <div>
                        {task.isCompleted ? (
                            <p>Complete</p>
                        ) : (
                            <p>No complete</p>

                        )}
                    </div>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                    <button onClick={() => handlePatch(task.id)}>IsCompleted</button>
                </div>
            ))}
        </div>
    );
}

export default Tasks;