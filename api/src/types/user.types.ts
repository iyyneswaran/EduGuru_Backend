export interface User {
    id: string
    name: string
    email: string
    role: 'STUDENT' | 'TEACHER'
    password?: string
    xp?: number
    streak?: number
    createdAt?: Date
}

export interface RegisterInput {
    name: string
    email: string
    password: string
    role: 'STUDENT' | 'TEACHER'
}

export interface LoginInput {
    email: string
    password: string
}

export interface AuthPayload {
    id: string
    email: string
    role: 'STUDENT' | 'TEACHER'
}