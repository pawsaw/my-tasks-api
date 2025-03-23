// taskService.ts
import { v4 as uuidv4 } from 'uuid';
import { Task } from './task';

const tasks: Task[] = [];

// Create a new task
export const createTask = (taskData: Omit<Task, 'id'>): Task => {
  const newTask = { id: uuidv4(), ...taskData };
  tasks.unshift(newTask);
  return newTask;
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  return tasks;
};

// Get task by ID
export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

// Update an existing task
export const updateTask = (
  id: string,
  taskData: Partial<Task>
): Task | undefined => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
    return tasks[taskIndex];
  }
  return undefined;
};

// Delete a task
export const deleteTask = (id: string): boolean => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    return true;
  }
  return false;
};
