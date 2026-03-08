import express from "express";
import cors from "cors";
import morgan from "morgan";

import chatRoutes from "./routes/chat.routes";
import practiceRoutes from "./routes/practice.routes";
import userRoutes from "./routes/user.routes";
import classroomRoutes from "./routes/classroom.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or preflight OPTIONS without origin)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://edu-guru-frontend.vercel.app"
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
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
