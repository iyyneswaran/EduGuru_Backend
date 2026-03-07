export interface User {
    id: string
    name: string
    email: string
    password?: string
    createdAt?: Date
}

export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface AuthPayload {
    id: string
    email: string
}