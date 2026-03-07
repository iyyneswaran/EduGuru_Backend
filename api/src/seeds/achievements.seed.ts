// Seed default achievements into the database
// Run with: npx ts-node-dev src/seeds/achievements.seed.ts

import { prisma } from "../config/database";

const achievements = [
    {
        key: "quiz_master",
        title: "Quiz Master",
        description: "Complete 5 quizzes.",
        icon: "star",
    },
    {
        key: "top_performer",
        title: "Top Performer",
        description: "Rank #1 on a classroom leaderboard.",
        icon: "trophy",
    },
    {
        key: "consistency",
        title: "Consistency",
        description: "Maintain a 7-day streak.",
        icon: "zap",
    },
    {
        key: "fast_learner",
        title: "Fast Learner",
        description: "Complete 3 modules in a single day.",
        icon: "book",
    },
    {
        key: "xp_club",
        title: "1000 XP Club",
        description: "Earn your first 1000 XP.",
        icon: "medal",
    },
    {
        key: "first_quiz",
        title: "First Quiz",
        description: "Complete your first quiz.",
        icon: "target",
    },
];

async function main() {
    for (const a of achievements) {
        await prisma.achievement.upsert({
            where: { key: a.key },
            update: { title: a.title, description: a.description, icon: a.icon },
            create: a,
        });
    }
    console.log(`Seeded ${achievements.length} achievements.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
