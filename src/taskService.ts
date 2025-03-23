// taskService.ts
import { v4 as uuidv4 } from "uuid";
import { Task } from "./task";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
  DeleteCommand,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Create a new task
export const createTask = async (taskData: Omit<Task, "id">): Promise<Task> => {
  const newTask = { id: uuidv4(), ...taskData };
  const cmdInput: PutCommandInput = {
    TableName: TASKS_TABLE,
    Item: newTask,
  };
  try {
    const command = new PutCommand(cmdInput);
    await docClient.send(command);
  } catch (error) {
    throw new Error("Failed to create task");
  }
  return newTask;
};

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  const cmdInput: ScanCommandInput = {
    TableName: TASKS_TABLE,
  };
  try {
    const command = new ScanCommand(cmdInput);
    const { Items } = await docClient.send(command);
    return Items as Task[];
  } catch (error) {
    throw new Error("Failed to get tasks");
  }
};

// Get task by ID
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  const cmdInput: GetCommandInput = {
    TableName: TASKS_TABLE,
    Key: { id },
  };
  try {
    const command = new GetCommand(cmdInput);
    const { Item } = await docClient.send(command);
    return Item as Task;
  } catch (error) {
    throw new Error("Failed to get task");
  }
};

// Update an existing task
export const updateTask = async (
  id: string,
  taskData: Partial<Task>
): Promise<Task | undefined> => {
  const task = await getTaskById(id);
  if (!task) {
    return undefined;
  }
  const updatedTask = { ...task, ...taskData };
  const cmdInput: PutCommandInput = {
    TableName: TASKS_TABLE,
    Item: updatedTask,
  };
  try {
    const command = new PutCommand(cmdInput);
    await docClient.send(command);
  } catch (error) {
    throw new Error("Failed to update task");
  }
  return updatedTask;
};

// Delete a task
export const deleteTask = async (id: string): Promise<boolean> => {
  const cmdInput: DeleteCommandInput = {
    TableName: TASKS_TABLE,
    Key: { id },
  };
  try {
    const command = new DeleteCommand(cmdInput);
    await docClient.send(command);
    return true;
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};
