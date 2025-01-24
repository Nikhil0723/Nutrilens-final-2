"use client";
import { Task } from "@/app/type/task";
import { createContext, useContext } from "react";

// Define context value structure
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteSelectedTasks: (selectedIds: string[]) => void;
  deleteDoneTasks: () => void;
  deleteAllTasks: () => void;
  togglePinnedTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
}
// Create context
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

// Custom hook
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
