import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { scheduleReminderJobs } from "./services/reminderService.js";

dotenv.config();

const PORT = process.env.PORT ?? 5000;

const bootstrap = async () => {
  try {
    await connectDB();
    scheduleReminderJobs();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

bootstrap();
