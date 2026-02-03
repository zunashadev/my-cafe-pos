"use client";

import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ordersChartConfig } from "./orders-chart.config";

type OrdersChartProps = {
  data: {
    label: string;
    total: number;
  }[];
};

export function OrdersLineChart({ data }: OrdersChartProps) {
  return (
    <ChartContainer config={ordersChartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Line
          dataKey="total"
          type="monotone"
          strokeWidth={2}
          dot={false}
          stroke="var(--color-total)"
        />
      </LineChart>
    </ChartContainer>
  );
}
