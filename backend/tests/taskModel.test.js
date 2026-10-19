import assert from "node:assert/strict";
import test from "node:test";
import Task from "../models/Task.js";

const ownerId = "64b000000000000000000001";

test("task title is required", () => {
  const error = new Task({ userId: ownerId }).validateSync();

  assert.ok(error?.errors.title);
});

test("task status must use a supported value", () => {
  const task = new Task({
    title: "Prepare demo",
    status: "blocked",
    userId: ownerId,
  });

  assert.ok(task.validateSync()?.errors.status);
});

test("task priority must use a supported value", () => {
  const task = new Task({
    title: "Prepare demo",
    priority: "urgent",
    userId: ownerId,
  });

  assert.ok(task.validateSync()?.errors.priority);
});

test("task owner is required", () => {
  const error = new Task({ title: "Prepare demo" }).validateSync();

  assert.ok(error?.errors.userId);
});

test("task title cannot exceed 100 characters", () => {
  const task = new Task({
    title: "x".repeat(101),
    userId: ownerId,
  });

  assert.ok(task.validateSync()?.errors.title);
});

test("task description cannot exceed 2000 characters", () => {
  const task = new Task({
    title: "Prepare demo",
    description: "x".repeat(2001),
    userId: ownerId,
  });

  assert.ok(task.validateSync()?.errors.description);
});
