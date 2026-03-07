import { Router } from "express";
import {
    generatePracticeQuestions,
    submitPracticeAnswer
} from "../controllers/practice.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/*
Generate questions
*/
router.post("/generate", authMiddleware, generatePracticeQuestions);

/*
Submit answer
*/
router.post("/submit", authMiddleware, submitPracticeAnswer);

export default router;