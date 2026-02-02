"use client";

import { useQuery } from "@tanstack/react-query";
import { getTables } from "./queries";
import { TableStatus } from "./types";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// 🔹 Base
export function useTables({
  page,
  limit,
  search,
  capacity,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  capacity?: number | null;
  status?: TableStatus | null;
}) {
  return useQuery({
    queryKey: ["tables", page, limit, search, capacity, status],
    queryFn: () => getTables({ page, limit, search, capacity, status }),
    placeholderData: (previousData) => previousData,
  });
}

// 🔹 Realtime
export function useTablesRealtime(onChange: () => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("tables-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
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
