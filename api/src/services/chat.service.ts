import { getAIExplanation } from "./ai.service";
import { prisma } from "../config/database";

export async function processMessage(userId: string, message: string) {

    const aiResponse = await getAIExplanation(message);

    const chat = await prisma.chat.create({
        data: {
            userId,
            message,
            response: aiResponse
        }
    });

    return chat;
}

export async function getHistory(userId: string) {

    const chats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50
    });

    return chats;
}