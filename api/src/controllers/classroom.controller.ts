import { Request, Response, NextFunction } from "express";
import * as classroomService from "../services/classroom.service";

// ─── Classrooms ─────────────────────────────────────────────────

export const createClassroom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, subject, description } = req.body;
        const teacherId = (req as any).user.id;
        const classroom = await classroomService.createClassroom(teacherId, { name, subject, description });
        res.status(201).json({ success: true, data: classroom });
    } catch (error) {
        next(error);
    }
};

export const getClassrooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        let classrooms;
        if (user.role === "TEACHER") {
            classrooms = await classroomService.getTeacherClassrooms(user.id);
        } else {
            classrooms = await classroomService.getStudentClassrooms(user.id);
        }
        res.json({ success: true, data: classrooms });
    } catch (error) {
        next(error);
    }
};

export const getClassroom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const classroom = await classroomService.getClassroom(req.params.id as string);
        res.json({ success: true, data: classroom });
    } catch (error) {
        next(error);
    }
};

export const joinClassroom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { code } = req.body;
        const classroom = await classroomService.joinClassroom(userId, code);
        res.json({ success: true, data: classroom });
    } catch (error) {
        next(error);
    }
};

export const getClassroomMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await classroomService.getClassroomMembers(req.params.id as string);
        res.json({ success: true, data: members });
    } catch (error) {
        next(error);
    }
};

// ─── Modules ────────────────────────────────────────────────────

export const createModule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, content, order } = req.body;
        const module = await classroomService.createModule(req.params.id as string, { title, description, content, order: Number(order) || 0 });
        res.status(201).json({ success: true, data: module });
    } catch (error) {
        next(error);
    }
};

export const getModules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const modules = await classroomService.getModulesWithProgress(req.params.id as string, userId);
        res.json({ success: true, data: modules });
    } catch (error) {
        next(error);
    }
};

export const completeModule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const result = await classroomService.completeModule(userId, req.params.moduleId as string, req.params.id as string);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// ─── Study Materials ────────────────────────────────────────────

export const createMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, fileUrl, type } = req.body;
        const material = await classroomService.createMaterial(req.params.id as string, { title, description, fileUrl, type });
        res.status(201).json({ success: true, data: material });
    } catch (error) {
        next(error);
    }
};

export const getMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const materials = await classroomService.getMaterials(req.params.id as string);
        res.json({ success: true, data: materials });
    } catch (error) {
        next(error);
    }
};

// ─── Quizzes ────────────────────────────────────────────────────

export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, timeLimit, points, questions } = req.body;
        const quiz = await classroomService.createQuiz(req.params.id as string, { title, description, timeLimit, points, questions });
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
};

export const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quizzes = await classroomService.getQuizzes(req.params.id as string);
        res.json({ success: true, data: quizzes });
    } catch (error) {
        next(error);
    }
};

export const getQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        let quiz;
        if (user.role === "TEACHER") {
            quiz = await classroomService.getQuiz(req.params.quizId as string);
        } else {
            quiz = await classroomService.getQuizForStudent(req.params.quizId as string);
        }
        res.json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { answers } = req.body;
        const result = await classroomService.submitQuiz(userId, req.params.quizId as string, answers);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// ─── Leaderboard ────────────────────────────────────────────────

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaderboard = await classroomService.getLeaderboard(req.params.id as string);
        res.json({ success: true, data: leaderboard });
    } catch (error) {
        next(error);
    }
};

// ─── Progress ───────────────────────────────────────────────────

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const progress = await classroomService.getStudentProgress(userId);
        res.json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

// ─── Achievements ───────────────────────────────────────────────

export const getAchievements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const achievements = await classroomService.getUserAchievements(userId);
        res.json({ success: true, data: achievements });
    } catch (error) {
        next(error);
    }
};

// ─── Admin ──────────────────────────────────────────────────────

export const getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = (req as any).user.id;
        const stats = await classroomService.getTeacherDashboard(teacherId);
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

export const getAdminStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = (req as any).user.id;
        const students = await classroomService.getTeacherStudents(teacherId);
        res.json({ success: true, data: students });
    } catch (error) {
        next(error);
    }
};
