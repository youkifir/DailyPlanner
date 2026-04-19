export enum Priority {
    low = "Low",
    middle = "Middle",
    high = "High"
}

export interface TaskResponseDTO {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    isCompleted: boolean;
    createdAt: Date;
}

export interface TaskRequestDTO {
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
}

export interface RegisterRequestDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequestDTO {
    email: string;
    password: string;
}