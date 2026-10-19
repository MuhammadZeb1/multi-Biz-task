import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} from "../controllers/taskController.js";

const router = express.Router();

// All routes below require a valid JWT
router.use(protect);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Task CRUD
router
  .route("/")
  .get(getTasks)
  .post(createTask);

router
  .route("/:id")
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

export default router;