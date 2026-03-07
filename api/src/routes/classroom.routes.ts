import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import * as cc from "../controllers/classroom.controller";

const router = Router();

// ─── Classrooms ─────────────────────────────────────────────────
router.get("/", authMiddleware, cc.getClassrooms);
router.post("/", authMiddleware, requireRole("TEACHER"), cc.createClassroom);
router.post("/join", authMiddleware, requireRole("STUDENT"), cc.joinClassroom);
router.get("/:id", authMiddleware, cc.getClassroom);
router.get("/:id/members", authMiddleware, cc.getClassroomMembers);

// ─── Modules ────────────────────────────────────────────────────
router.post("/:id/modules", authMiddleware, requireRole("TEACHER"), cc.createModule);
router.get("/:id/modules", authMiddleware, cc.getModules);
router.post("/:id/modules/:moduleId/complete", authMiddleware, requireRole("STUDENT"), cc.completeModule);

// ─── Study Materials ────────────────────────────────────────────
router.post("/:id/materials", authMiddleware, requireRole("TEACHER"), cc.createMaterial);
router.get("/:id/materials", authMiddleware, cc.getMaterials);

// ─── Quizzes ────────────────────────────────────────────────────
router.post("/:id/quizzes", authMiddleware, requireRole("TEACHER"), cc.createQuiz);
router.get("/:id/quizzes", authMiddleware, cc.getQuizzes);
router.get("/:id/quizzes/:quizId", authMiddleware, cc.getQuiz);
router.post("/:id/quizzes/:quizId/submit", authMiddleware, requireRole("STUDENT"), cc.submitQuiz);

// ─── Leaderboard ────────────────────────────────────────────────
router.get("/:id/leaderboard", authMiddleware, cc.getLeaderboard);

// ─── Progress / Achievements ────────────────────────────────────
router.get("/student/progress", authMiddleware, cc.getProgress);
router.get("/student/achievements", authMiddleware, cc.getAchievements);

// ─── Admin ──────────────────────────────────────────────────────
router.get("/admin/dashboard", authMiddleware, requireRole("TEACHER"), cc.getAdminDashboard);
router.get("/admin/students", authMiddleware, requireRole("TEACHER"), cc.getAdminStudents);

export default router;
