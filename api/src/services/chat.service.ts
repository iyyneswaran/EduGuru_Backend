import { getChatResponse } from "./ai.service";
import { prisma } from "../config/database";

export async function processMessage(userId: string, message: string) {

    // Fetch last 10 chats (oldest-first) for conversation context
    const recentChats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        take: 10,
    });

    const history = recentChats.flatMap((c) => [
        { role: "user" as const, content: c.message },
        { role: "assistant" as const, content: c.response },
    ]);

    const aiResponse = await getChatResponse(message, history);

    const chat = await prisma.chat.create({
        data: {
            userId,
            message,
            response: aiResponse,
        },
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