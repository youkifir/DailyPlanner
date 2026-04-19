import { useEffect, useState } from "react";
import { getAll, patch, remove, update } from "../api/tasks";
import type { TaskRequestDTO, TaskResponseDTO } from "../types";

const Tasks = () => {
    const [tasks, setTasks] = useState<TaskResponseDTO[]>([]);

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

    return (
        <div>
            <div>
                <input type="text" />
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