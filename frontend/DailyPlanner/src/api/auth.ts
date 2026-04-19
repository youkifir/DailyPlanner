import instance from "./axios";
import type { LoginRequestDTO, RegisterRequestDTO } from "../types";

export const register = async (data: RegisterRequestDTO) => {
    const response = await instance.post("auth/register", data);
    return response;
}

export const login = async (data: LoginRequestDTO) => {
    const response = await instance.post("auth/login", data);
    return response.data;
}

