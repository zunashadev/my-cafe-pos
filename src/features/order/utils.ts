import { OrderAnalyticsRow, OrderWithTable, TodaySummary } from "./types";

export function groupOrdersByDay(orders: OrderAnalyticsRow[]) {
  const map = new Map<string, number>();

  orders.forEach((order) => {
    const label = new Date(order.created_at).toISOString().slice(0, 10); // YYYY-MM-DD

    map.set(label, (map.get(label) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([label, total]) => ({
    label,
    total,
  }));
}

function getWeekKey(date: Date) {
  const firstDayOfWeek = new Date(date);
  firstDayOfWeek.setDate(date.getDate() - date.getDay()); // Minggu
  return firstDayOfWeek.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function groupOrdersByWeek(orders: OrderAnalyticsRow[]) {
  const map = new Map<string, number>();

  orders.forEach((order) => {
    const label = getWeekKey(new Date(order.created_at));
    map.set(label, (map.get(label) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([label, total]) => ({
    label,
    total,
  }));
}

export function groupOrdersByMonth(orders: OrderAnalyticsRow[]) {
  const map = new Map<string, number>();

  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`; // YYYY-MM

    map.set(label, (map.get(label) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([label, total]) => ({
    label,
    total,
  }));
}

export function buildTodaySummary(orders: OrderWithTable[]): TodaySummary {
  const summary: TodaySummary = {
    totalOrders: orders.length,
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    progress: 0,
    statusBreakdown: {
      draft: 0,
      confirmed: 0,
      served: 0,
      paid: 0,
      cancelled: 0,
    },
    activeOrderList: [],
  };

  for (const order of orders) {
    summary.statusBreakdown[order.status]++;

    if (order.status === "paid") {
      summary.completedOrders++;
    } else if (order.status === "cancelled") {
      summary.cancelledOrders++;
    } else {
      summary.activeOrders++;
      summary.activeOrderList.push(order);
    }
  }

  summary.progress =
    summary.totalOrders === 0
      ? 0
      : Math.round((summary.completedOrders / summary.totalOrders) * 100);

  return summary;
}
