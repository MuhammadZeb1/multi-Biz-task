import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskFlow server running on port ${PORT}`);
  });
};

startServer();