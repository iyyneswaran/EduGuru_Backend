import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from "./env";

const pool = new Pool({ connectionString: env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}