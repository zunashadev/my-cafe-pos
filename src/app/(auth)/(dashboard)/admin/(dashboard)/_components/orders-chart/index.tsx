"use client";

import { Button } from "@/components/ui/button";
import { useOrdersAnalytics } from "@/features/order/hooks";
import { OrdersLineChart } from "./orders-line-chart";

export default function OrdersAnalitycsCard() {
  const { data, mode, setMode, isLoading } = useOrdersAnalytics();

  if (isLoading) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Mode Switch */}
      <div className="flex gap-2">
        <Button
          variant={mode === "day" ? "default" : "outline"}
          onClick={() => setMode("day")}
        >
          Day
        </Button>
        <Button
          variant={mode === "week" ? "default" : "outline"}
          onClick={() => setMode("week")}
        >
          Week
        </Button>
        <Button
          variant={mode === "month" ? "default" : "outline"}
          onClick={() => setMode("month")}
        >
          Month
        </Button>
      </div>

      {/* Chart */}
      <OrdersLineChart data={data} />
    </div>
  );
}
