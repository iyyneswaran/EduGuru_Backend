import axios from "axios";
import { env } from "../config/env";

const AI_BASE = env.AI_SERVICE_URL;

export async function getAIExplanation(message: string) {

    const response = await axios.post(`${AI_BASE}/explain`, {
        question: message
    });

    return response.data;
}

export async function generatePractice(topic: string, difficulty: string) {

    const response = await axios.post(`${AI_BASE}/practice`, {
        topic,
        difficulty
    });

    return response.data.questions;
}