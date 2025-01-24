"use client";

import React, { useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import EmojiPicker, {  EmojiClickData } from "emoji-picker-react";
import { Edit, SmilePlus, Trash2 } from "lucide-react";

const Categories: React.FC = () => {
  const { appData, addCategory, editCategory, deleteCategory } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>(appData.taskColors[0]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false); // Manage picker visibility

  // Handle emoji selection
  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    setEmoji(emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  // Toggle emoji picker visibility
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev); // Toggle the emoji picker visibility
  };

  // Reset inputs
  const resetInputs = () => {
    setSelectedCategory(null);
    setEmoji("😊");
    setName("");
    setColor(appData.taskColors[0]);
    setIsEditing(false);
  };

  // Handle add or update
  const handleSaveCategory = () => {
    if (isEditing && selectedCategory) {
      editCategory({ id: selectedCategory, emoji, name, color });
    } else {
      const newCategory = {
        id: crypto.randomUUID(),
        emoji,
        name,
        color,
      };
      addCategory(newCategory);
    }
    resetInputs();
  };

  // Handle edit
  const handleEditCategory = (categoryId: string) => {
    const category = appData.categories.find((cat) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setEmoji(category.emoji);
      setName(category.name);
      setColor(category.color);
      setIsEditing(true);
    }
  };

  // Handle delete
  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    if (selectedCategory === categoryId) resetInputs();
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto w-full m-4">
      <h2 className="text-xl font-bold">Manage Categories</h2>

      {/* Scrollable Category List */}
      <div className="h-60 overflow-y-auto border p-4 rounded shadow-md space-y-3">
        {appData.categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-2 rounded hover:bg-gray-100"
            style={{ backgroundColor: `${category.color}` }}
          >
            <div className="flex items-center space-x-3 px-4 py-1">
              <span className="text-4xl">{category.emoji}</span>
              <span className=" font-semibold">{category.name}</span>
            </div>
            <div className="space-x-2">
              <button
                className="text-blue-500 bg-white p-2 rounded-full"
                onClick={() => handleEditCategory(category.id)}
              >
                <Edit />
              </button>
              <button
                className="text-red-500 p-2 bg-white rounded-full"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <div className="space-y-4 my-20 ">
        {/* Emoji Picker */}
        <h1 className=" text-center font-extrabold text-2xl">
          Add New Category
        </h1>
        <div className="flex items-center justify-center space-x-3">
          <div className="">
            <div
              className="text-6xl cursor-pointer text-center"
              onClick={toggleEmojiPicker}
            >
              {emoji || <SmilePlus size={52}/>}
            </div>
            {isEmojiPickerOpen && (
              <div>
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  className=" max-w-sm mx-auto m-4 top-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Category Name Input */}
        <input
          type="text"
          className="border rounded px-4 py-2 w-full"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Color Selector */}
        <select
          className="border rounded px-4 py-2 w-full"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          {appData.taskColors.map((colorOption, index) => (
            <option
              key={index}
              value={colorOption}
              style={{ backgroundColor: `${colorOption}` }}
            >
              {colorOption}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex justify-between gap-28">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex-auto"
            onClick={handleSaveCategory}
          >
            {isEditing ? "Update Category" : "Create Category"}
          </button>
          {isEditing && (
            <button
              className="bg-gray-500 flex-auto text-white px-4 py-2 rounded"
              onClick={resetInputs}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
