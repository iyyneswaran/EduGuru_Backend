import { generatePractice } from "./ai.service";
import * as questionRepo from "../repositories/question.repo";

export async function generateQuestions(topic: string, difficulty: string) {

    const questions = await generatePractice(topic, difficulty);

    await questionRepo.saveQuestions(questions);

    return questions;
}

export async function evaluateAnswer(questionId: string, answer: string) {

    const question = await questionRepo.getQuestionById(questionId);

    const isCorrect = question.correctAnswer === answer;

    return {
        correct: isCorrect,
        correctAnswer: question.correctAnswer
    };
}