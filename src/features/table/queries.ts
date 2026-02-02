import { createClient } from "@/lib/supabase/client";
import { Table, TableStatus } from "./types";

export async function getTables({
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
}): Promise<{
  data: Table[];
  total: number;
}> {
  const supabase = createClient();

  // 🔹 Base Query
  let query = supabase
    .from("tables")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // 🔹 Search -> Name, Description
  if (search?.trim()) {
    const q = search.trim();
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // 🔹 Filter -> Capacity
  if (capacity !== null && capacity !== undefined) {
    query = query.eq("capacity", capacity);
  }

  // 🔹 Filter -> Status
  if (status) {
    query = query.eq("status", status);
  }

  // 🔹 Pagination
  let data, error, count;

  if (page && limit) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    ({ data, error, count } = await query.range(from, to));
  } else {
    ({ data, error, count } = await query);
  }

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}
