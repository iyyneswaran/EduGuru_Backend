/*
Shared API Types
Used by:
- frontend
- backend
- AI service communication
*/

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data: T
}


/*
User
*/

export interface UserDTO {
    id: string
    name: string
    email: string
    createdAt: string
}


/*
Chat
*/

export interface ChatRequest {
    message: string
}

export interface ChatResponse {
    id: string
    message: string
    response: string
    createdAt: string
}


/*
Practice
*/

export interface PracticeQuestion {
    id?: string
    topic: string
    difficulty: string
    question: string
    correctAnswer?: string
}

export interface PracticeResponse {
    questions: PracticeQuestion[]
}


/*
Concept Map
*/

export interface ConceptNode {
    id: string
    label: string
}

export interface ConceptEdge {
    source: string
    target: string
}

export interface ConceptMap {
    nodes: ConceptNode[]
    edges: ConceptEdge[]
}