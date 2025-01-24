"use client";

import { createContext, useContext } from "react";

// Define AppData structure
export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface AppData {
  username: string;
  backgroundColor: string;
  profileImage: string;
  categories: Category[];
  taskColors: string[];
}

// Context value structure
interface AppDataContextType {
  appData: AppData;
  updateAppData: (newData: Partial<AppData>) => void;
  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

// Create context
export const AppDataContext = createContext<AppDataContextType | undefined>(
  undefined
);

// Custom hook
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};
