"use client";

import React, { useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react"; // Import the emoji picker component
import { SmilePlus } from "lucide-react";

const CreateTaskForm: React.FC = () => {
  const router = useRouter();
  const { appData } = useAppData();
  const { addTask } = useTaskContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(appData.taskColors[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(""); // Store the selected emoji
  const [error, setError] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false); // Manage emoji picker visibility

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev); // Toggle emoji picker visibility
  };

  const handleEmojiSelect = (emoji: { emoji: string }) => {
    setSelectedEmoji(emoji.emoji); // Update the selected emoji state
    setIsEmojiPickerOpen(false); // Close the emoji picker after selection
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const deadlineDate = deadline ? new Date(deadline) : null;

    const newTask = {
      id: uuidv4(),
      emoji: selectedEmoji, // Use selected emoji here
      name: title,
      description,
      color: selectedColor,
      done: false,
      pinned: false,
      date: new Date().toISOString(),
      deadline: deadlineDate ? deadlineDate.toISOString() : null,
      lastSave: new Date().toISOString(),
      category: selectedCategories.map((id) => {
        const matchedCategory = appData.categories.find((cat) => cat.id === id);
        return (
          matchedCategory || {
            id,
            name: "Unknown",
            emoji: "❓",
            color: "#000000",
          }
        );
      }),
    };

    addTask(newTask);

    // Clear form
    setTitle("");
    setDescription("");
    setSelectedColor(appData.taskColors[0]);
    setSelectedCategories([]);
    setDeadline("");
    setSelectedEmoji(""); // Reset emoji when form is submitted
    setError("");

    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-center sm:text-left">
          Create New Task
        </h2>
        {error && (
          <p className="text-red-500 text-center sm:text-left">{error}</p>
        )}

        {/* Emoji Picker */}
        <div className="flex items-center justify-center space-x-3">
          <div className="">
            <div
              className="text-6xl cursor-pointer text-center"
              onClick={toggleEmojiPicker}
            >
              {selectedEmoji || <SmilePlus size={52} />}
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

        {/* Title Input */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            className="w-full"
          />
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full"
          />
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="categories">Categories</Label>
          <div className="space-y-2">
            {appData.categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 p-2 rounded-md"
                style={{ backgroundColor: category.color }}
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={category.id}>
                  {category.name}{" "}
                  <span className="ml-1" style={{ color: category.color }}>
                    {category.emoji.startsWith("1f") &&
                    category.emoji.length === 5
                      ? String.fromCodePoint(parseInt(category.emoji, 16))
                      : category.emoji}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline Input */}
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            type="datetime-local"
            id="deadline"
            value={deadline || ""}
            onChange={(e) => setDeadline(e.target.value || null)}
            className="w-full"
          />
        </div>

        {/* Task Color */}
        <div>
          <Label htmlFor="color">Task Color</Label>
          <Select
            value={selectedColor}
            onValueChange={(value) => setSelectedColor(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {appData.taskColors.map((color) => (
                <SelectItem key={color} value={color}>
                  <div
                    className="flex items-center space-x-2"
                    style={{
                      backgroundColor: color,
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <span>{color}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-600 text-white">
          Create Task
        </Button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
