import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

function PieChartDemo({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  const [animatedCount, setAnimatedCount] = React.useState(0);

  // Animation effect to count up from 0 to count
  React.useEffect(() => {
    let start = 0;
    const end = count;
    const duration = 1000; // Animation duration in milliseconds
    const increment = end / (duration / 16); // Approx 60fps (1000ms / 16ms per frame)

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCount(end);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer); // Cleanup on unmount

    // Reset animatedCount when count changes
  }, [count]);

  const chartConfig: ChartConfig = {
    [title.toLowerCase()]: {
      label: title,
      color: "hsl(var(--chart-1))",
    },
  };

  const chartData = React.useMemo(
    () => [{ name: title, value: count, fill: "hsl(var(--chart-1))" }],
    [title, count]
  );

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {animatedCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {title}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChartDemo;