import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import serverless from "serverless-http";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./taskService";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Validation Middleware
const validateTask = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
  body("status")
    .isIn(["To Do", "In Progress", "Completed"])
    .withMessage("Invalid status"),
];

// Get all tasks
app.get("/api/tasks", async (req: Request, res: Response): Promise<void> => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

// Get task by ID
app.get(
  "/api/tasks/:id",
  [param("id").isUUID()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const task = await getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Create a new task
app.post(
  "/api/tasks",
  validateTask,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const newTask = await createTask(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Update an existing task
app.put(
  "/api/tasks/:id",
  [param("id").isUUID(), ...validateTask],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const updatedTask = await updateTask(req.params.id, req.body);
      if (!updatedTask) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Delete a task
app.delete(
  "/api/tasks/:id",
  param("id").isUUID(),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const success = await deleteTask(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

export const handler = serverless(app);
