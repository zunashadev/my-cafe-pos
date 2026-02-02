import { createClient } from "@/lib/supabase/client";
import { Profile } from "./types";

export async function getProfiles({
  page,
  limit,
  search,
  role,
}: {
  page: number;
  limit: number;
  search?: string;
  role?: string | null;
}): Promise<{
  data: Profile[];
  total: number;
}> {
  const supabase = createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // 🔹 SEARCH -> baru name
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // 🔹 FILTER -> ROLE
  if (role) {
    query = query.eq("role", role);
  }

  // 🔹 PAGINATION
  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}
