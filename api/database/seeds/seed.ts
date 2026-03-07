import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {

    console.log("🌱 Seeding database...")

    const user = await prisma.user.create({
        data: {
            name: "Demo User",
            email: "demo@eduguru.ai",
            password: "hashedpassword"
        }
    })

    await prisma.question.createMany({
        data: [
            {
                topic: "Photosynthesis",
                difficulty: "easy",
                question: "What is photosynthesis?",
                correctAnswer: "Process by which plants convert sunlight into energy"
            },
            {
                topic: "Photosynthesis",
                difficulty: "medium",
                question: "Which pigment is responsible for photosynthesis?",
                correctAnswer: "Chlorophyll"
            },
            {
                topic: "Newton Laws",
                difficulty: "easy",
                question: "What is Newton's First Law?",
                correctAnswer: "Law of inertia"
            }
        ]
    })

    console.log("✅ Seeding completed")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })