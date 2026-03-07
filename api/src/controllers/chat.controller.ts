import { Request, Response, NextFunction } from "express";
import * as chatService from "../services/chat.service";

export const sendChatMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;
        const { message } = req.body;

        const response = await chatService.processMessage(userId, message);

        res.json({
            success: true,
            data: response
        });
    } catch (error: any) {
        console.error("[CHAT CONTROLLER ERROR]", error.message);
        res.status(500).json({
            success: false,
            error: error.message || "Something went wrong. Please try again.",
        });
    }
};

export const getChatHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;

        const history = await chatService.getHistory(userId);

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        next(error);
    }
};