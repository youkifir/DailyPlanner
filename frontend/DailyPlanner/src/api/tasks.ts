import instance from "./axios";
import type { TaskRequestDTO } from "../types";

export const getAll = async () => {
    const response = await instance.get("/tasks");
    return response.data;
}

export const get = async (id: number) => {
    const response = await instance.get(`/tasks/${id}`);
    return response.data;
}

export const create = async (data: TaskRequestDTO) => {
    const response = await instance.post("/tasks/create", data);
    return response;
}

export const update = async (id: number, data: TaskRequestDTO) => {
    const response = await instance.put(`/tasks/task/edit/${id}`, data);
    return response;
}

export const patch = async (id: number) => {
    const response = await instance.patch(`/tasks/task/${id}/complete`)
    return response;
}

export const remove = async (id: number) => {
    const response = await instance.delete(`tasks/task/${id}`);
    return response;
}