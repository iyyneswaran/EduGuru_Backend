import { prisma } from "../config/database";

export async function saveQuestions(questions: any[]) {

    const saved = await prisma.question.createMany({
        data: questions
    });

    return saved;
}

export async function getQuestionById(id: string) {

    return prisma.question.findUnique({
        where: { id }
    });
}