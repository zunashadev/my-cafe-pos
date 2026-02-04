"use client";

import { OrderStatusBadge } from "@/components/shared/order/order-status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { USER_ROLE } from "@/features/auth/constants";
import { useAuthStore } from "@/features/auth/stores";
import { useOrdersRealtime, useTodaySummary } from "@/features/order/hooks";
import { Order } from "@/features/order/types";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TodaySummary() {
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  // 🔹 Fetch Orders Data from DB
  const {
    data: todaySummaryData,
    isLoading: todaySummaryIsLoading,
    isError: todaySummaryIsError,
    error: todaySummaryError,
    refetch: todaySummaryRefetch,
  } = useTodaySummary();

  useOrdersRealtime(todaySummaryRefetch);

  // 🔹 Toast Error
  useEffect(() => {
    if (todaySummaryIsError && todaySummaryError) {
      toast.error("Get Orders Data Failed", {
        description: todaySummaryError.message,
      });
    }
  }, [todaySummaryIsError, todaySummaryError]);

  console.log(todaySummaryData);

  // 🔹 Handle View Detail
  const router = useRouter();

  const handleViewDetail = (order: Order) => {
    if (profile && profile.role === USER_ROLE.ADMIN) {
      router.push(`/admin/orders/${order.order_id}`);
    }
    if (profile && profile.role === USER_ROLE.CASHIER) {
      router.push(`/cashier/orders/${order.order_id}`);
    }
    if (profile && profile.role === USER_ROLE.KITCHEN) {
      router.push(`/kitchen/orders/${order.order_id}`);
    }
  };

  return (
    <div className="scrollbar h-min w-full overflow-hidden rounded-md border">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-semibold">Active Orders</h4>
            <span className="text-xl">({todaySummaryData?.activeOrders})</span>
          </div>
          <div></div>
        </div>
      </div>

      <Separator className="bg-muted" />

      <div className="h-80 space-y-2 overflow-x-auto p-6">
        {todaySummaryData?.activeOrderList.map((order) => (
          <div
            key={order.order_id}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{order.order_id}</p>
                <span className="text-muted-foreground text-sm">
                  ({order.tables.name})
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {order.customer_name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.status} />
              <Button variant="ghost" onClick={() => handleViewDetail(order)}>
                View Detail
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
