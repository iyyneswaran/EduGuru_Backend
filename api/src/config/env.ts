import dotenv from "dotenv";

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: Number(process.env.PORT) || 5000,

    DATABASE_URL: process.env.DATABASE_URL || "",

    JWT_SECRET: process.env.JWT_SECRET || "supersecret",

    AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://localhost:8000",
};