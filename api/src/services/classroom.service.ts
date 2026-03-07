import * as classroomRepo from "../repositories/classroom.repo";
import crypto from "crypto";

// ─── Classroom ──────────────────────────────────────────────────

function generateCode(): string {
    return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char code
}

export async function createClassroom(teacherId: string, data: { name: string; subject: string; description?: string }) {
    let code = generateCode();
    // Ensure unique code
    while (await classroomRepo.findClassroomByCode(code)) {
        code = generateCode();
    }
    return classroomRepo.createClassroom({
        ...data,
        code,
        teacherId,
    });
}

export async function getTeacherClassrooms(teacherId: string) {
    return classroomRepo.findTeacherClassrooms(teacherId);
}

export async function getStudentClassrooms(userId: string) {
    const memberships = await classroomRepo.findStudentClassrooms(userId);
    return memberships.map((m) => m.classroom);
}

export async function getClassroom(classroomId: string) {
    const classroom = await classroomRepo.findClassroomById(classroomId);
    if (!classroom) throw new Error("Classroom not found");
    return classroom;
}

export async function joinClassroom(userId: string, code: string) {
    const classroom = await classroomRepo.findClassroomByCode(code);
    if (!classroom) throw new Error("Invalid classroom code");

    const alreadyMember = await classroomRepo.isMember(userId, classroom.id);
    if (alreadyMember) throw new Error("Already a member of this classroom");

    await classroomRepo.addMember(userId, classroom.id);

    // Unlock the first module for the new student
    const modules = await classroomRepo.getModules(classroom.id);
    if (modules.length > 0) {
        await classroomRepo.upsertModuleProgress(userId, modules[0].id, "UNLOCKED");
    }

    return classroom;
}

// ─── Modules ────────────────────────────────────────────────────

export async function createModule(classroomId: string, data: { title: string; description?: string; content?: string; order: number }) {
    return classroomRepo.createModule({ ...data, classroomId });
}

export async function getModulesWithProgress(classroomId: string, userId: string) {
    const modules = await classroomRepo.getModulesWithProgress(classroomId, userId);
    return modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        content: m.content,
        order: m.order,
        status: m.progress.length > 0 ? m.progress[0].status : "LOCKED",
        completedAt: m.progress.length > 0 ? m.progress[0].completedAt : null,
    }));
}

export async function completeModule(userId: string, moduleId: string, classroomId: string) {
    // Mark this module as completed
    await classroomRepo.upsertModuleProgress(userId, moduleId, "COMPLETED");

    // Unlock the next module
    const modules = await classroomRepo.getModules(classroomId);
    const currentIndex = modules.findIndex((m) => m.id === moduleId);
    if (currentIndex >= 0 && currentIndex < modules.length - 1) {
        const nextModule = modules[currentIndex + 1];
        const nextProgress = await classroomRepo.getModuleProgress(userId, nextModule.id);
        if (!nextProgress || nextProgress.status === "LOCKED") {
            await classroomRepo.upsertModuleProgress(userId, nextModule.id, "UNLOCKED");
        }
    }

    // Award XP for module completion
    await classroomRepo.updateUserXp(userId, 50);

    // Update streak
    await updateStreak(userId);

    return { success: true };
}

// ─── Study Materials ────────────────────────────────────────────

export async function createMaterial(classroomId: string, data: { title: string; description?: string; fileUrl: string; type?: "PDF" | "VIDEO" | "NOTES" }) {
    return classroomRepo.createMaterial({ ...data, classroomId });
}

export async function getMaterials(classroomId: string) {
    return classroomRepo.getMaterials(classroomId);
}

// ─── Quizzes ────────────────────────────────────────────────────

export async function createQuiz(
    classroomId: string,
    data: {
        title: string;
        description?: string;
        timeLimit?: number;
        points?: number;
        questions: { question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: string }[];
    }
) {
    return classroomRepo.createQuiz({ ...data, classroomId });
}

export async function getQuizzes(classroomId: string) {
    return classroomRepo.getQuizzes(classroomId);
}

export async function getQuiz(quizId: string) {
    const quiz = await classroomRepo.getQuizWithQuestions(quizId);
    if (!quiz) throw new Error("Quiz not found");
    return quiz;
}

export async function getQuizForStudent(quizId: string) {
    const quiz = await classroomRepo.getQuizWithQuestions(quizId);
    if (!quiz) throw new Error("Quiz not found");
    // Don't expose correct answers to students
    return {
        ...quiz,
        questions: quiz.questions.map(({ correctAnswer, ...q }) => q),
    };
}

export async function submitQuiz(userId: string, quizId: string, answers: { questionId: string; answer: string }[]) {
    const quiz = await classroomRepo.getQuizWithQuestions(quizId);
    if (!quiz) throw new Error("Quiz not found");

    let correctCount = 0;
    for (const ans of answers) {
        const question = quiz.questions.find((q) => q.id === ans.questionId);
        if (question && question.correctAnswer === ans.answer) {
            correctCount++;
        }
    }

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * quiz.points) : 0;

    const attempt = await classroomRepo.createQuizAttempt({
        quizId,
        userId,
        score,
        totalPoints: quiz.points,
        answers: JSON.stringify(answers),
    });

    // Award XP
    await classroomRepo.updateUserXp(userId, score);

    // Update streak
    await updateStreak(userId);

    return {
        attemptId: attempt.id,
        score,
        totalPoints: quiz.points,
        correctCount,
        totalQuestions,
    };
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
    return classroomRepo.getUserQuizAttempts(userId, quizId);
}

// ─── Leaderboard ────────────────────────────────────────────────

export async function getLeaderboard(classroomId: string) {
    return classroomRepo.getClassroomLeaderboard(classroomId);
}

// ─── Progress ───────────────────────────────────────────────────

export async function getStudentProgress(userId: string) {
    const [user, quizAttempts] = await Promise.all([
        classroomRepo.getUserById(userId),
        classroomRepo.getUserAllQuizAttempts(userId),
    ]);

    if (!user) throw new Error("User not found");

    const totalQuizzes = quizAttempts.length;
    const totalScore = quizAttempts.reduce((sum, a) => sum + a.score, 0);
    const totalPoints = quizAttempts.reduce((sum, a) => sum + a.totalPoints, 0);
    const accuracy = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;

    return {
        xp: user.xp,
        streak: user.streak,
        quizzesCompleted: totalQuizzes,
        quizAccuracy: accuracy,
        lastActive: user.lastActiveDate,
    };
}

// ─── Achievements ───────────────────────────────────────────────

export async function getUserAchievements(userId: string) {
    const [allAchievements, userAchievements] = await Promise.all([
        classroomRepo.getAchievements(),
        classroomRepo.getUserAchievements(userId),
    ]);

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    return allAchievements.map((a) => ({
        ...a,
        unlocked: unlockedIds.has(a.id),
        unlockedAt: userAchievements.find((ua) => ua.achievementId === a.id)?.unlockedAt ?? null,
    }));
}

export async function checkAndUnlockAchievements(userId: string) {
    const [user, quizAttempts, userAchievements] = await Promise.all([
        classroomRepo.getUserById(userId),
        classroomRepo.getUserAllQuizAttempts(userId),
        classroomRepo.getUserAchievements(userId),
    ]);

    if (!user) return;

    const unlockedKeys = new Set(userAchievements.map((ua) => ua.achievement.key));
    const newlyUnlocked: string[] = [];

    // Quiz Master — complete 5 quizzes
    if (!unlockedKeys.has("quiz_master") && quizAttempts.length >= 5) {
        const a = await classroomRepo.findAchievementByKey("quiz_master");
        if (a) {
            await classroomRepo.unlockAchievement(userId, a.id);
            newlyUnlocked.push("quiz_master");
        }
    }

    // Consistency — 7-day streak
    if (!unlockedKeys.has("consistency") && user.streak >= 7) {
        const a = await classroomRepo.findAchievementByKey("consistency");
        if (a) {
            await classroomRepo.unlockAchievement(userId, a.id);
            newlyUnlocked.push("consistency");
        }
    }

    // XP Club — 1000 XP
    if (!unlockedKeys.has("xp_club") && user.xp >= 1000) {
        const a = await classroomRepo.findAchievementByKey("xp_club");
        if (a) {
            await classroomRepo.unlockAchievement(userId, a.id);
            newlyUnlocked.push("xp_club");
        }
    }

    return newlyUnlocked;
}

// ─── Streak ─────────────────────────────────────────────────────

export async function updateStreak(userId: string) {
    const user = await classroomRepo.getUserById(userId);
    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (user.lastActiveDate) {
        const lastActive = new Date(user.lastActiveDate);
        const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already active today, just update lastActiveDate
            return;
        } else if (diffDays === 1) {
            // Consecutive day — increment streak
            await classroomRepo.updateUserStreak(userId, user.streak + 1, now);
        } else {
            // Missed days — reset streak
            await classroomRepo.updateUserStreak(userId, 1, now);
        }
    } else {
        // First activity ever
        await classroomRepo.updateUserStreak(userId, 1, now);
    }

    // Check achievements after streak update
    await checkAndUnlockAchievements(userId);
}

// ─── Admin ──────────────────────────────────────────────────────

export async function getTeacherDashboard(teacherId: string) {
    return classroomRepo.getTeacherStats(teacherId);
}

export async function getTeacherStudents(teacherId: string) {
    return classroomRepo.getTeacherStudents(teacherId);
}

export async function getClassroomMembers(classroomId: string) {
    return classroomRepo.getClassroomMembers(classroomId);
}
