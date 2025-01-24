"use client";

import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext"; // Adjust the path as necessary
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const DeleteTasksPage = () => {
  const { tasks, deleteSelectedTasks, deleteDoneTasks, deleteAllTasks } =
    useTaskContext()!;
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Toggle task selection
  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId) // Deselect
        : [...prevSelected, taskId] // Select
    );
  };

  // Handle delete selected tasks
  const handleDeleteSelected = () => {
    deleteSelectedTasks(selectedTasks); // Delete selected tasks
    setSelectedTasks([]); // Clear selection
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6  p-4">
      <h1 className="text-xl font-bold text-center">Manage Tasks</h1>

      {/* Scrollable Task List */}
      <div className="max-h-64 overflow-y-auto border rounded-lg p-4 space-y-4 shadow">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                task.done
                  ? "bg-green-100 border-l-4 border-green-500"
                  : "bg-gray-100 border-l-4 border-gray-500"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={() => handleSelectTask(task.id)}
                />
                <span
                  className={`text-sm ${
                    task.done ? "line-through text-gray-500" : "text-gray-900"
                  }`}
                >
                  {task.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {task.done ? "Done" : "Not Done"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks available</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-4">
        <Button
          onClick={handleDeleteSelected}
          variant="default"
          disabled={tasks.length === 0 || selectedTasks.length === 0}
        >
          Delete Selected
        </Button>
        <Button
          onClick={deleteDoneTasks}
          variant="outline"
          disabled={tasks.length === 0 || !tasks.some((task) => task.done)}
        >
          Delete Done Tasks
        </Button>
        <Button
          onClick={deleteAllTasks}
          variant="destructive"
          disabled={tasks.length === 0}
        >
          Delete All Tasks
        </Button>
      </div>
    </div>
  );
};

export default DeleteTasksPage;
