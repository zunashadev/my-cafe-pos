import { requireRole } from "@/lib/auth/require-role";
import { ReactNode } from "react";

export default async function CashierDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["cashier"]);

  return <>{children}</>;
}
