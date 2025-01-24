"use client";
import {
  getTasksFromLocalStorage,
  saveTasksToLocalStorage,
} from "@/app/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { Task } from "@/app/type/task";
import { TaskContext } from "./TaskContext";

// TaskProvider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const generateNewId = () => `task-${Date.now()}`;

  useEffect(() => {
    const storedTasks = getTasksFromLocalStorage();
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const addTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  // Function to update a task
  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const togglePinnedTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, pinned: !task.pinned } : task
    );
    setTasks(sortTasks(updatedTasks));
    saveTasksToLocalStorage(updatedTasks);
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const duplicateTask = (taskId: string) => {
    const taskToDuplicate = tasks.find((task) => task.id === taskId);

    if (taskToDuplicate) {
      const newTask = {
        ...taskToDuplicate,
        id: generateNewId(),
        date: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, newTask];

      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    }
  };

  // Delete selected tasks
  const deleteSelectedTasks = (selectedIds: string[]) => {
    const updatedTasks = tasks.filter((task) => !selectedIds.includes(task.id));
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  // Delete all done tasks
  const deleteDoneTasks = () => {
    const updatedTasks = tasks.filter((task) => !task.done);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  // Delete all tasks
  const deleteAllTasks = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
  };

  const sortTasks = (tasks: Task[]): Task[] => {
    return tasks.sort((a, b) => {
      // First, ensure pinned tasks are always at the top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Ensure createdAt is a valid number
      const createdAtA =
        typeof a.date === "number" ? a.date : new Date(a.date).getTime();
      const createdAtB =
        typeof b.date === "number" ? b.date : new Date(b.date).getTime();

      // Sort by creation timestamp for unpinned tasks
      return createdAtA - createdAtB;
    });
  };
  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        removeTask,
        updateTask,
        toggleTaskCompletion,
        deleteSelectedTasks,
        deleteDoneTasks,
        deleteAllTasks,
        togglePinnedTask,
        duplicateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
