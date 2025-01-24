"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTaskContext } from "@/context/TaskContext";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const { tasks } = useTaskContext(); // Access tasks from context

  // Find the task using the provided ID
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-2xl">Task not found!</h1>
      </div>
    );
  }

  return (
    <div className=" mt-14 flex items-center justify-center">
      <div className="bg-white p-8 shadow-2xl rounded-3xl md:max-w-screen-md w-full">
        <h1 className="text-center font-bold text-4xl mb-9">Task: {task.name || "No name provided"}</h1>
        <div>
          {/* Emoji */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Emoji:</h1>
            <p>
              {task.emoji || 
                (task.category.length > 0 
                  ? task.category.map((cat) => cat.emoji).join(", ") 
                  : "None")}
            </p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* ID */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">ID:</h1>
            <p>{task.id || "None"}</p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* Description */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Description:</h1>
            <p>{task.description || "No description provided"}</p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* Color */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Color:</h1>
            <p className="flex items-center space-x-2">
              {task.color ? (
                <>
                  <span
                    className="inline-block w-5 h-5 mr-1 rounded-md"
                    style={{ backgroundColor: task.color }}
                  ></span>{" "}
                  {task.color}
                </>
              ) : (
                "None"
              )}
            </p>
          </div>
          <Separator className="bg-[#B558FF] my-2 h-[1px]" />

          {/* Created Date */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Created:</h1>
            <p>{task.date ? new Date(task.date).toLocaleString() : "None"}</p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* Done */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Done:</h1>
            <p>{task.done ? "Yes" : "No"}</p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* Pinned */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Pinned:</h1>
            <p>{task.pinned ? "Yes" : "No"}</p>
          </div>
          <Separator className="bg-[#B558FF] my-2" />

          {/* Categories */}
          <div className="flex items-center justify-start px-2">
            <h1 className="w-40 font-bold md:text-xl">Categories:</h1>
            <p>{task.category && task.category.length > 0 ? task.category.map((cat) => cat.name).join(", ") : "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
