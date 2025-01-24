"use client";

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "#B558FF",
  },
} satisfies ChartConfig;

interface TaskProgressProps {
  percentage: number;
  totalTasks: number;
  completedTasks: number;
}

export function TaskProgress({
  percentage,
  totalTasks,
  completedTasks,
}: TaskProgressProps) {
  const angle = (percentage * 360) / 100;

  const chartData = [{ name: "Progress", value: percentage, fill: "#B558FF" }];

  return (
    <div className="text-lg">
      <div className="w-full border  border-[#B558FF] md:p-3 flex items-center justify-start md:space-x-3 rounded-3xl">
        <ChartContainer config={chartConfig} className="h-24 w-24">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - angle}
            innerRadius={29}
            outerRadius={45}
          >
            <PolarGrid gridType="circle" radialLines={false} stroke="#E0E0E0" />
            <RadialBar
              dataKey="value"
              background={{ fill: "#E0E0E0" }}
              cornerRadius={500}
              fill="#B558FF"
            />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold fill-black"
            >
              {Math.round(percentage)}%
            </text>
          </RadialBarChart>
        </ChartContainer>

        <div className="  text-sm md:text-lg">
          <p className="font-bold">
            You&#39;ve completed {completedTasks} out of {totalTasks} tasks.
          </p>
          {percentage === 100 ? (
            <p>Congratulations! All tasks completed!</p>
          ) : (
            <p>Keep going! {totalTasks - completedTasks} task(s) left.</p>
          )}
        </div>
      </div>
    </div>
  );
}
