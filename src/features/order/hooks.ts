"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderMenuStatus, OrderStatus } from "./types";
import {
  getOrderById,
  getOrderMenus,
  getOrders,
  getOrdersForAnalytics,
  getOrdersMenusSummary,
} from "./queries";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  groupOrdersByDay,
  groupOrdersByMonth,
  groupOrdersByWeek,
} from "./utils";

// 🔹 Use Orders
export function useOrders({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus | null;
}) {
  return useQuery({
    queryKey: ["orders", page, limit, search, status],
    queryFn: () => getOrders({ page, limit, search, status }),
    placeholderData: (previousData) => previousData,
  });
}

// 🔹 Use Orders - Realtime
export function useOrdersRealtime(onChange: () => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          onChange();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}

// 🔹 Use Order
export function useOrder(order_id: string) {
  return useQuery({
    queryKey: ["order", order_id],
    queryFn: () => getOrderById(order_id),
    placeholderData: (previousData) => previousData,
    enabled: !!order_id,
  });
}

// 🔹 Use Order Menus
export function useOrderMenus({
  order_id,
  page,
  limit,
  search,
  status,
}: {
  order_id?: string;
  page: number;
  limit: number;
  search?: string;
  status?: OrderMenuStatus | null;
}) {
  return useQuery({
    queryKey: ["order-menus", order_id, page, limit, search, status],
    queryFn: () =>
      getOrderMenus({ order_id: order_id!, page, limit, search, status }),
    placeholderData: (previousData) => previousData,
    enabled: !!order_id,
  });
}

// 🔹 Use Orders Menus Summary
export function useOrdersMenusSummary(order_ids: string[]) {
  return useQuery({
    queryKey: ["orders-menus-summary", order_ids],
    queryFn: () => getOrdersMenusSummary({ order_ids }),
    enabled: order_ids.length > 0,
    placeholderData: (previousData) => previousData,
  });
}

// 🔹 Use Orders Menus - Realtime
export function useOrdersMenusRealtime(onChange: () => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("orders-menus-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders_menus",
        },
        () => {
          onChange();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}

// 🔹 Use Orders Analytics
export function useOrdersAnalytics() {
  const [mode, setMode] = useState<"day" | "week" | "month">("day");

  const query = useQuery({
    queryKey: ["orders-analytics"],
    queryFn: getOrdersForAnalytics,
    staleTime: 1000 * 60, // 1 menit
  });

  const data = useMemo(() => {
    if (!query.data) return [];

    switch (mode) {
      case "day":
        return groupOrdersByDay(query.data);
      case "week":
        return groupOrdersByWeek(query.data);
      case "month":
        return groupOrdersByMonth(query.data);
      default:
        return [];
    }
  }, [query.data, mode]);

  return {
    data,
    mode,
    setMode,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
