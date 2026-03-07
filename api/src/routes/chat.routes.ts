import { Router } from "express";
import {
    sendChatMessage,
    getChatHistory
} from "../controllers/chat.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/*
Send message to AI
*/
router.post("/message", authMiddleware, sendChatMessage);

/*
Chat history
*/
router.get("/history", authMiddleware, getChatHistory);

export default router;