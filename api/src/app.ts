import express from "express";
import cors from "cors";
import morgan from "morgan";

import chatRoutes from "./routes/chat.routes";
import practiceRoutes from "./routes/practice.routes";
import userRoutes from "./routes/user.routes";
import classroomRoutes from "./routes/classroom.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://edu-guru-frontend.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/*
Routes
*/
app.use("/api/chat", chatRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classrooms", classroomRoutes);

/*
Health check
*/
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "EduGuru Backend",
    });
});

/*
Global Error Handler
*/
app.use(errorMiddleware);

export default app;