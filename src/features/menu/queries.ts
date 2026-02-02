import { createClient } from "@/lib/supabase/client";
import { Menu } from "./types";

export async function getMenus({
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
}): Promise<{
  data: Menu[];
  total: number;
}> {
  const supabase = createClient();

  let query = supabase
    .from("menus")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // 🔹 SEARCH -> Name
  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  // 🔹 FILTER -> Category
  if (category) {
    query = query.eq("category", category);
  }

  // 🔹 FILTER -> Availability
  if (typeof isAvailable === "boolean") {
    query = query.eq("is_available", isAvailable);
  }

  // 🔹 PAGINATION
  if (page && limit) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  // 🔹 EXECUTION
  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}
