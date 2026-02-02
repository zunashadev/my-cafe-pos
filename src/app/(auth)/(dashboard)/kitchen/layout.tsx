import { requireRole } from "@/lib/auth/require-role";
import { ReactNode } from "react";

export default async function KitchenDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["kitchen"]);

  return <>{children}</>;
}
