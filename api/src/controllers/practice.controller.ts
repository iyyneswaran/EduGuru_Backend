import { Request, Response, NextFunction } from "express";
import * as practiceService from "../services/practice.service";

export const generatePracticeQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { topic, difficulty } = req.body;

        const questions = await practiceService.generateQuestions(
            topic,
            difficulty
        );

        res.json({
            success: true,
            data: questions
        });
    } catch (error) {
        next(error);
    }
};

export const submitPracticeAnswer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { questionId, answer } = req.body;

        const result = await practiceService.evaluateAnswer(
            questionId,
            answer
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};