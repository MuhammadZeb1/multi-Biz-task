import mongoose from "mongoose";
import Task from "../models/Task.js";

const allowedStatuses = ["todo", "in-progress", "completed"];
const allowedPriorities = ["low", "medium", "high"];

// Validate MongoDB task IDs
const isValidId = (id) => mongoose.isValidObjectId(id);

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 100 characters",
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (
      dueDate !== undefined &&
      dueDate !== null &&
      dueDate !== ""
    ) {
      if (
        typeof dueDate !== "string" ||
        !Number.isFinite(Date.parse(dueDate))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// GET ALL OWN TASKS + SEARCH + FILTER + SORT
export const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Always restrict results to the authenticated user
    const filter = {
      userId: req.user.id,
    };

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter",
        });
      }

      filter.status = status;
    }

    if (priority) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority filter",
        });
      }

      filter.priority = priority;
    }

    if (search !== undefined) {
      if (typeof search !== "string" || search.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search must be at most 100 characters",
        });
      }

      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.title = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "dueDate") {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sort !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Sort must be dueDate or newest",
      });
    }

    const tasks = await Task.find(filter)
      .sort(sortOption)
      .lean();

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Only allow editable task fields.
    // Never allow the client to change userId or timestamps.
    const updates = {};

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Title must be between 1 and 100 characters",
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message: "Description must be at most 2000 characters",
        });
      }

      updates.description = description.trim();
    }

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      updates.status = status;
    }

    if (priority !== undefined) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority",
        });
      }

      updates.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        updates.dueDate = null;
      } else if (
        typeof dueDate === "string" &&
        Number.isFinite(Date.parse(dueDate))
      ) {
        updates.dueDate = new Date(dueDate);
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

// DASHBOARD STATISTICS + RECENT TASKS
export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [counts, recentTasks] = await Promise.all([
      Task.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Task.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const statusCounts = {
      todo: 0,
      "in-progress": 0,
      completed: 0,
    };

    counts.forEach(({ _id, count }) => {
      statusCounts[_id] = count;
    });

    const totalTasks = Object.values(statusCounts).reduce(
      (total, count) => total + count,
      0
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        ...statusCounts,
      },
      recentTasks,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};