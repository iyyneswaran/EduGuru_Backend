import express from "express";
import cors from "cors";
import morgan from "morgan";

import chatRoutes from "./routes/chat.routes";
import practiceRoutes from "./routes/practice.routes";
import userRoutes from "./routes/user.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/*
Routes
*/
app.use("/api/chat", chatRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/users", userRoutes);

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