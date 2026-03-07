import { Router } from "express";
import {
    registerUser,
    loginUser,
    getProfile
} from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/*
User authentication
*/
router.post("/register", registerUser);
router.post("/login", loginUser);

/*
Protected routes
*/
router.get("/profile", authMiddleware, getProfile);

export default router;