"use client";

import React, { useState, useEffect } from "react";
import { AppData, AppDataContext, Category } from "./AppDataContext";
import {
  getAppDataFromLocalStorage,
  saveAppDataToLocalStorage,
} from "@/app/utils/localStorage";

// Default app data (used as fallback when no data is in localStorage)
const defaultAppData: AppData = {
  username: "John Doe",
  backgroundColor: "#f0f0f0",
  profileImage: "/path/to/image",
  categories: [
    { id: "1", name: "Work", emoji: "😊", color: "#ff5733" },
    { id: "2", name: "Personal", emoji: "🏡", color: "#33ff57" },
    { id: "3", name: "Fitness", emoji: "🏋️", color: "#3357ff" },
  ],
  taskColors: ["#ff5733", "#33ff57", "#3357ff", "#ffdf3d", "#e843fe"],
};

interface AppDataProviderProps {
  children: React.ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({
  children,
}) => {
  const [appData, setAppData] = useState<AppData>(defaultAppData);

  useEffect(() => {
    const storedAppData = getAppDataFromLocalStorage();
    if (storedAppData) {
      setAppData(storedAppData);
    }
  }, []);

  // Save app data to localStorage whenever it changes
  useEffect(() => {
    saveAppDataToLocalStorage(appData);
  }, [appData]);

  // Update entire app data
  const updateAppData = (newData: Partial<AppData>) => {
    setAppData((prev) => ({ ...prev, ...newData }));
  };

  // Add a new category
  const addCategory = (category: Category) => {
    setAppData((prev) => ({
      ...prev,
      categories: [...prev.categories, category],
    }));
  };

  // Edit an existing category
  const editCategory = (updatedCategory: Category) => {
    setAppData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      ),
    }));
  };

  // Delete a category by ID
  const deleteCategory = (categoryId: string) => {
    setAppData((prev) => ({
      ...prev,
      categories: prev.categories.filter(
        (category) => category.id !== categoryId
      ),
    }));
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        updateAppData,
        addCategory,
        editCategory,
        deleteCategory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
