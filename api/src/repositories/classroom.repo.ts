import { prisma } from "../config/database";

// ─── Classroom CRUD ──────────────────────────────────────────────

export async function createClassroom(data: {
    name: string;
    subject: string;
    description?: string;
    code: string;
    teacherId: string;
}) {
    return prisma.classroom.create({ data });
}

export async function findClassroomById(id: string) {
    return prisma.classroom.findUnique({
        where: { id },
        include: {
            teacher: { select: { id: true, name: true, email: true } },
            _count: { select: { members: true, modules: true, quizzes: true, materials: true } },
        },
    });
}

export async function findClassroomByCode(code: string) {
    return prisma.classroom.findUnique({ where: { code } });
}

export async function findTeacherClassrooms(teacherId: string) {
    return prisma.classroom.findMany({
        where: { teacherId },
        include: {
            _count: { select: { members: true, modules: true, quizzes: true, materials: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function findStudentClassrooms(userId: string) {
    return prisma.classroomMember.findMany({
        where: { userId },
        include: {
            classroom: {
                include: {
                    teacher: { select: { id: true, name: true } },
                    _count: { select: { members: true, modules: true, quizzes: true, materials: true } },
                },
            },
        },
        orderBy: { joinedAt: "desc" },
    });
}

// ─── Classroom Members ──────────────────────────────────────────

export async function addMember(userId: string, classroomId: string) {
    return prisma.classroomMember.create({
        data: { userId, classroomId },
    });
}

export async function isMember(userId: string, classroomId: string) {
    const member = await prisma.classroomMember.findUnique({
        where: { userId_classroomId: { userId, classroomId } },
    });
    return !!member;
}

export async function getClassroomMembers(classroomId: string) {
    return prisma.classroomMember.findMany({
        where: { classroomId },
        include: {
            user: { select: { id: true, name: true, email: true, xp: true, streak: true } },
        },
    });
}

// ─── Modules ────────────────────────────────────────────────────

export async function createModule(data: {
    classroomId: string;
    title: string;
    description?: string;
    content?: string;
    order: number;
}) {
    return prisma.module.create({ data });
}

export async function getModules(classroomId: string) {
    return prisma.module.findMany({
        where: { classroomId },
        orderBy: { order: "asc" },
    });
}

export async function getModuleProgress(userId: string, moduleId: string) {
    return prisma.moduleProgress.findUnique({
        where: { userId_moduleId: { userId, moduleId } },
    });
}

export async function getModulesWithProgress(classroomId: string, userId: string) {
    const modules = await prisma.module.findMany({
        where: { classroomId },
        include: {
            progress: { where: { userId } },
        },
        orderBy: { order: "asc" },
    });
    return modules;
}

export async function upsertModuleProgress(userId: string, moduleId: string, status: "LOCKED" | "UNLOCKED" | "COMPLETED") {
    return prisma.moduleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId } },
        update: {
            status,
            completedAt: status === "COMPLETED" ? new Date() : null,
        },
        create: {
            userId,
            moduleId,
            status,
            completedAt: status === "COMPLETED" ? new Date() : null,
        },
    });
}

// ─── Study Materials ────────────────────────────────────────────

export async function createMaterial(data: {
    classroomId: string;
    title: string;
    description?: string;
    fileUrl: string;
    type?: "PDF" | "VIDEO" | "NOTES";
}) {
    return prisma.studyMaterial.create({ data });
}

export async function getMaterials(classroomId: string) {
    return prisma.studyMaterial.findMany({
        where: { classroomId },
        orderBy: { createdAt: "desc" },
    });
}

// ─── Quizzes ────────────────────────────────────────────────────

export async function createQuiz(data: {
    classroomId: string;
    title: string;
    description?: string;
    timeLimit?: number;
    points?: number;
    questions: {
        question: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctAnswer: string;
    }[];
}) {
    const { questions, ...quizData } = data;
    return prisma.quiz.create({
        data: {
            ...quizData,
            questions: {
                create: questions,
            },
        },
        include: { questions: true },
    });
}

export async function getQuizzes(classroomId: string) {
    return prisma.quiz.findMany({
        where: { classroomId },
        include: { _count: { select: { questions: true, attempts: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function getQuizWithQuestions(quizId: string) {
    return prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
    });
}

export async function createQuizAttempt(data: {
    quizId: string;
    userId: string;
    score: number;
    totalPoints: number;
    answers: string;
}) {
    return prisma.quizAttempt.create({ data });
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
    return prisma.quizAttempt.findMany({
        where: { userId, quizId },
        orderBy: { completedAt: "desc" },
    });
}

export async function getUserAllQuizAttempts(userId: string) {
    return prisma.quizAttempt.findMany({
        where: { userId },
        include: { quiz: { select: { id: true, title: true, classroomId: true } } },
        orderBy: { completedAt: "desc" },
    });
}

// ─── Leaderboard ────────────────────────────────────────────────

export async function getClassroomLeaderboard(classroomId: string) {
    // Get all members with their XP
    const members = await prisma.classroomMember.findMany({
        where: { classroomId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    xp: true,
                    streak: true,
                },
            },
        },
    });

    return members
        .map((m) => ({
            userId: m.user.id,
            name: m.user.name,
            xp: m.user.xp,
            streak: m.user.streak,
        }))
        .sort((a, b) => b.xp - a.xp)
        .map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));
}

// ─── Achievements ───────────────────────────────────────────────

export async function getAchievements() {
    return prisma.achievement.findMany();
}

export async function getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
    });
}

export async function unlockAchievement(userId: string, achievementId: string) {
    return prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId } },
        update: {},
        create: { userId, achievementId },
    });
}

export async function findAchievementByKey(key: string) {
    return prisma.achievement.findUnique({ where: { key } });
}

// ─── User Stats ─────────────────────────────────────────────────

export async function updateUserXp(userId: string, xpToAdd: number) {
    return prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpToAdd } },
    });
}

export async function updateUserStreak(userId: string, streak: number, lastActiveDate: Date) {
    return prisma.user.update({
        where: { id: userId },
        data: { streak, lastActiveDate },
    });
}

export async function getUserById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            xp: true,
            streak: true,
            lastActiveDate: true,
            createdAt: true,
        },
    });
}

// ─── Admin Stats ────────────────────────────────────────────────

export async function getTeacherStats(teacherId: string) {
    const [totalClassrooms, totalStudents, totalQuizzes] = await Promise.all([
        prisma.classroom.count({ where: { teacherId } }),
        prisma.classroomMember.count({
            where: { classroom: { teacherId } },
        }),
        prisma.quiz.count({
            where: { classroom: { teacherId } },
        }),
    ]);

    // Top students across teacher's classrooms
    const topStudents = await prisma.classroomMember.findMany({
        where: { classroom: { teacherId } },
        include: {
            user: { select: { id: true, name: true, xp: true, streak: true } },
        },
        distinct: ["userId"],
        orderBy: { user: { xp: "desc" } },
        take: 5,
    });

    return {
        totalClassrooms,
        totalStudents,
        totalQuizzes,
        topStudents: topStudents.map((m) => m.user),
    };
}

export async function getTeacherStudents(teacherId: string) {
    const members = await prisma.classroomMember.findMany({
        where: { classroom: { teacherId } },
        include: {
            user: { select: { id: true, name: true, email: true, xp: true, streak: true } },
            classroom: { select: { id: true, name: true } },
        },
    });
    return members;
}
