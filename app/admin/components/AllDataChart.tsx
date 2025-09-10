"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "count",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function AlldataChart({ data }) {
  const chartData = [
    // { field: "Students", count: data.studentCount, fill: "var(--color-chrome)" },
    { field: "Staff", count: data.staffCount, fill: "var(--color-chrome)" },
    { field: "Course", count: data.courseCount, fill: "var(--color-safari)" },
    { field: "Class", count: data.classCount, fill: "var(--color-firefox)" },
    // { field: "other", count: 90, fill: "var(--color-edge)" },
    // { field: "other", count: 90, fill: "var(--color-other)" },
  ];

  return (
    <Card className="flex flex-col border-gray-300 col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>All Data</CardTitle>
        <CardDescription>
          Students, staffs, courses and classes at one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-video max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" label nameKey="field" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
