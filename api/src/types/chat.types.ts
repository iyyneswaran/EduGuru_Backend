export interface ChatMessage {
    id?: string
    userId: string
    message: string
    response: string
    createdAt?: Date
}

export interface ChatRequest {
    message: string
}

export interface ChatHistory {
    id: string
    message: string
    response: string
    createdAt: Date
}