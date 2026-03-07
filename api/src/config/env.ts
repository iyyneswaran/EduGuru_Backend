import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../../.env"),
];

for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing. Add it to backend/.env or backend/api/.env before starting the API."
    );
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: Number(process.env.PORT) || 5000,

    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET || "supersecret",

    AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://localhost:8000",
};
