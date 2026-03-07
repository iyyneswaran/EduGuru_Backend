import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

const PORT = env.PORT || 5000;

async function startServer() {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${env.NODE_ENV}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();