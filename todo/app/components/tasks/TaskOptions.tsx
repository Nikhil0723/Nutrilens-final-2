"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Pin,
  FileText,
  Volume,
  Share2,
  Edit,
  Repeat,
  Trash2,
  PinOff,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTaskContext } from "@/context/TaskContext"; // Import the context
interface TaskOptionsProps {
  taskId: string; // Accept only taskId as a prop
}

export const TaskOptions: React.FC<TaskOptionsProps> = ({ taskId }) => {
  const router = useRouter();
  const {
    toggleTaskCompletion,
    removeTask,
    togglePinnedTask,
    duplicateTask,
    tasks,
  } = useTaskContext();
  const task = tasks.find((t) => t.id === taskId); // Find the task with the given ID

  const showDetail = () => {
    router.push(`/task/${taskId}`); // Redirect to the task
  };

  const menuItems = task
    ? [
        {
          label: task.done ? "Mark as not Done" : "Mark as Done",
          icon: task.done ? <X /> : <Check />,
          action: () => toggleTaskCompletion(taskId),
        },
        {
          label: task.pinned ? "Unpin" : "Pin",
          icon: task.pinned ? <PinOff /> : <Pin />,
          action: () => togglePinnedTask(taskId),
        },
        {
          label: "Select",
          icon: <FileText />,
          action: () => {
            console.log("Select Task");
          },
        },
        {
          label: "Task Detail",
          icon: <FileText />,
          action: showDetail,
        },
        {
          label: "Read Loud",
          icon: <Volume />,
          action: () => {
            console.log("Read Loud");
          },
        },
        {
          label: "Share",
          icon: <Share2 />,
          action: () => {
            console.log("Share Task");
          },
        },
        {
          label: "Edit",
          icon: <Edit />,
          action: () => {
            console.log("Edit Task");
          },
        },
        {
          label: "Duplicate",
          icon: <Repeat />,
          action: () => duplicateTask(taskId),
        },
        {
          label: "Delete",
          icon: <Trash2 />,
          action: () => removeTask(taskId),
        },
      ]
    : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full w-8 h-8 flex items-center justify-center bg-opacity-0 bg-gray-100 hover:bg-opacity-15 ">
          <HiOutlineDotsVertical className="text-lg md:text-2xl" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="w-48 p-2 bg-white shadow-lg rounded-lg"
      >
        <div className="flex flex-col space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start space-x-2"
                size="sm"
                onClick={item.action} // Dynamically handle actions
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>{" "}
                {/* Ensure left-aligned */}
              </Button>
              {index === 1 || index === 3 || index === 5 ? (
                <Separator className="my-1" />
              ) : null}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
