// src/utils/localStorageUtils.ts

import { AppData } from "@/context/AppDataContext";
import { Task } from "../type/task";

// LocalStorage keys
const LOCAL_STORAGE_TASKS_KEY = "tasks";
const LOCAL_STORAGE_APP_DATA_KEY = "appData";

// Tasks
export const getTasksFromLocalStorage = (): Task[] => {
  if (typeof window !== "undefined") {
    const tasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }
  return [];
};

export const saveTasksToLocalStorage = (tasks: Task[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  }
};

// AppData
export const getAppDataFromLocalStorage = (): AppData | null => {
  if (typeof window !== "undefined") {
    const appData = localStorage.getItem(LOCAL_STORAGE_APP_DATA_KEY);
    return appData ? JSON.parse(appData) : null;
  }
  return null;
};

export const saveAppDataToLocalStorage = (appData: AppData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_APP_DATA_KEY, JSON.stringify(appData));
  }
};
