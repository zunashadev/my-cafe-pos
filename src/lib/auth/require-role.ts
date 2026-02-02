import { redirect } from "next/navigation";
import { requireAuth } from "./require-auth";

type Role = "admin" | "cashier" | "kitchen";

export async function requireRole(allowedRoles: Role[]) {
  const { supabase, user } = await requireAuth();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/403");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/403");
  }

  return { user, profile };
}
