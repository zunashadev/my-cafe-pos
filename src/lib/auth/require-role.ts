import { redirect } from "next/navigation";
import { requireAuth } from "./require-auth";
import { UserRole } from "@/features/auth/types";

export async function requireRole(allowedRoles: UserRole[]) {
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
