"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfiles } from "./queries";

export function useProfiles({
  page,
  limit,
  search,
  role,
}: {
  page: number;
  limit: number;
  search?: string;
  role?: string | null;
}) {
  return useQuery({
    queryKey: ["profiles", page, limit, search, role],
    queryFn: () => getProfiles({ page, limit, search, role }),
    placeholderData: (previousData) => previousData,
  });
}
