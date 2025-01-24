import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  searchQuery: string; // Accept searchQuery as a prop
}

export const TaskList = ({ searchQuery }: TaskListProps) => {
  const { tasks } = useTaskContext();

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=" flex flex-col gap-4">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} searchQuery={searchQuery} />
      ))}
      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No tasks found</p>
      )}
    </div>
  );
};
