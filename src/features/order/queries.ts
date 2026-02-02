import { createClient } from "@/lib/supabase/client";
import {
  OrderAnalyticsRow,
  OrderMenusSummary,
  OrderMenuStatus,
  OrderMenuWithMenu,
  OrderStatus,
  OrderWithTable,
} from "./types";

export async function getOrders({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus | null;
}): Promise<{
  data: OrderWithTable[];
  total: number;
}> {
  const supabase = createClient();

  // 🔹 Pagination Logic
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 🔹 Base Query
  let query = supabase
    .from("orders")
    .select(`*, tables(*)`, { count: "exact" })
    .order("created_at", { ascending: false });

  // 🔹 Search -> Name, Description
  if (search?.trim()) {
    const q = search.trim();
    query = query.or(`order_id.ilike.%${q}%,customer_name.ilike.%${q}%`);
  }

  // 🔹 Filter -> Status
  if (status) {
    query = query.eq("status", status);
  }

  // 🔹 Pagination
  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function getOrderById(
  order_id: string,
): Promise<OrderWithTable | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, tables(*)")
    .eq("order_id", order_id)
    .single();

  if (error) throw error;

  return data;
}

export async function getOrderMenus({
  order_id,
  page,
  limit,
  search,
  status,
}: {
  order_id: string;
  page: number;
  limit: number;
  search?: string;
  status?: OrderMenuStatus | null;
}): Promise<{
  data: OrderMenuWithMenu[];
  total: number;
}> {
  const supabase = createClient();

  // 🔹 Pagination Logic
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 🔹 Base Query
  let query = supabase
    .from("orders_menus")
    .select(`*, menus(*)`, { count: "exact" })
    .eq("order_id", order_id)
    .order("status");

  // 🔹 Search -> Notes + Menu Name
  if (search?.trim()) {
    const q = search.trim();

    // 1️⃣ cari menu_id berdasarkan nama menu
    const { data: menus, error: menuError } = await supabase
      .from("menus")
      .select("id")
      .ilike("name", `%${q}%`);

    if (menuError) throw menuError;

    const menuIds = menus?.map((m) => m.id) ?? [];

    // 2️⃣ gabungkan search
    if (menuIds.length > 0) {
      query = query.or(`notes.ilike.%${q}%,menu_id.in.(${menuIds.join(",")})`);
    } else {
      query = query.or(`notes.ilike.%${q}%`);
    }
  }

  // 🔹 Filter -> Status
  if (status) {
    query = query.eq("status", status);
  }

  // 🔹 Pagination
  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function getOrdersMenusSummary({
  order_ids,
}: {
  order_ids: string[];
}) {
  if (order_ids.length === 0) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders_menus")
    .select("order_id, status")
    .in("order_id", order_ids);

  if (error) throw error;

  const summaryMap = new Map<string, OrderMenusSummary>();

  for (const row of data as { order_id: string; status: OrderMenuStatus }[]) {
    const current = summaryMap.get(row.order_id) ?? {
      order_id: row.order_id,
      total_items: 0,
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      cancelled: 0,
    };

    current.total_items += 1;
    current[row.status] += 1;

    summaryMap.set(row.order_id, current);
  }

  return Array.from(summaryMap.values());
}

export async function getOrdersForAnalytics(): Promise<OrderAnalyticsRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data ?? [];
}
