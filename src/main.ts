import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import serverless from 'serverless-http';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from './taskService';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Validation Middleware
const validateTask = [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters long'),
  body('status')
    .isIn(['To Do', 'In Progress', 'Completed'])
    .withMessage('Invalid status'),
];

// Get all tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  const tasks = getAllTasks();
  res.json(tasks);
});

// Get task by ID
app.get(
  '/api/tasks/:id',
  [param('id').isUUID()],
  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const task = getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  }
);

// Create a new task
app.post('/api/tasks', validateTask, (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const newTask = createTask(req.body);
  res.status(201).json(newTask);
});

// Update an existing task
app.put(
  '/api/tasks/:id',
  [param('id').isUUID(), ...validateTask],
  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const updatedTask = updateTask(req.params.id, req.body);
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json(updatedTask);
  }
);

// Delete a task
app.delete(
  '/api/tasks/:id',
  param('id').isUUID(),
  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const success = deleteTask(req.params.id);
    if (!success) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(204).send();
  }
);


export const handler = serverless(app);
