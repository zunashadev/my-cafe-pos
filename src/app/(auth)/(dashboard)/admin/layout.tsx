import { requireRole } from "@/lib/auth/require-role";
import { ReactNode } from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["admin"]);

  return <>{children}</>;
}
