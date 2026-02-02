"use client";

import { useQuery } from "@tanstack/react-query";
import { getMenus } from "./queries";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// 🔹 Base
export function useMenus({
  page,
  limit,
  search,
  category,
  isAvailable,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string | null;
  isAvailable?: boolean;
}) {
  return useQuery({
    queryKey: ["menus", page, limit, search, category, isAvailable],
    queryFn: () => getMenus({ page, limit, search, category, isAvailable }),
    placeholderData: (previousData) => previousData,
  });
}

// 🔹 Realtime
export function useMenusRealtime(onChange: () => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("menus-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menus",
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
