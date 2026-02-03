"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import DataTablePagination from "@/components/shared/data-table/data-table-pagination";
import DataTable from "@/components/shared/data-table/data-table";
import { LIMIT_OPTIONS } from "@/constants/data-table-constant";
import {
  useOrders,
  useOrdersMenusRealtime,
  useOrdersMenusSummary,
  useOrdersRealtime,
} from "@/features/order/hooks";
import {
  Order,
  OrderMenusSummary,
  OrderStatus,
  OrderWithTableAndSummary,
} from "@/features/order/types";
import { tableColumns } from "./table-columns";
import OrdersManagementToolbar from "./toolbar";
import { updateOrderStatus } from "@/features/order/actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores";
import { USER_ROLE } from "@/features/auth/constants";

export default function OrdersManagement() {
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  // 🔹 UI States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[1]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | null>(null);

  // 🔹 Fetch Orders Data from DB
  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    isError: ordersIsError,
    error: ordersError,
    refetch: ordersRefetch,
  } = useOrders({
    page,
    limit,
    search: useDebounce(search, 500),
    status,
  });

  useOrdersRealtime(ordersRefetch);

  // 🔹 Toast Error
  useEffect(() => {
    if (ordersIsError && ordersError) {
      toast.error("Get Orders Data Failed", {
        description: ordersError.message,
      });
    }
  }, [ordersIsError, ordersError]);

  // 🔹 Fetch Orders Summary from DB
  const orderIds = ordersData?.data.map((order) => order.order_id) ?? [];

  const { data: ordersMenusSummaryData, refetch: ordersMenusSummaryRefetch } =
    useOrdersMenusSummary(orderIds as string[]);

  useOrdersMenusRealtime(ordersMenusSummaryRefetch);

  const summaryMap = useMemo<Map<string, OrderMenusSummary>>(() => {
    return new Map((ordersMenusSummaryData ?? []).map((s) => [s.order_id, s]));
  }, [ordersMenusSummaryData]);

  const ordersWithSummary = useMemo<OrderWithTableAndSummary[]>(() => {
    if (!ordersData?.data) return [];

    return ordersData.data.map((order) => ({
      ...order,
      summary: summaryMap.get(order.order_id!) ?? {
        order_id: order.id!,
        total_items: 0,
        pending: 0,
        preparing: 0,
        ready: 0,
        served: 0,
        cancelled: 0,
      },
    }));
  }, [ordersData, summaryMap]);

  // 🔹 Handle Update Status
  const [updateOrderStatusState, updateOrderStatusAction] = useActionState(
    updateOrderStatus,
    INITIAL_STATE_ACTION,
  );

  const handleUpdateOrderStatus = async (
    order: Order,
    nextStatus: OrderStatus,
  ) => {
    if (!order.id || !order.table_id) {
      return console.log("Order ID or Table ID not found");
    }

    const formData = new FormData();

    formData.append("id", order.id);
    formData.append("table_id", order.table_id);
    formData.append("status", nextStatus);

    startTransition(() => {
      updateOrderStatusAction(formData);
    });
  };

  useEffect(() => {
    if (updateOrderStatusState?.status === "error") {
      toast.error("Update Order Status Failed", {
        description: updateOrderStatusState.errors?._form?.[0],
      });
    }

    if (updateOrderStatusState?.status === "success") {
      toast.success("Update Order Status Success");
    }
  }, [updateOrderStatusState]);

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
    <div className="space-y-4">
      {/* Start : Toolbar */}
      <OrdersManagementToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        statusFilter={status}
        onStatusFilterChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />
      {/* End : Toolbar */}

      {/* Start : Table & Pagination */}
      <div className="bg-primary-foreground rounded-md border p-2">
        <DataTable
          data={ordersWithSummary}
          columns={tableColumns({
            userRole: profile?.role,
            onUpdateOrderStatus: handleUpdateOrderStatus,
            onViewDetail: handleViewDetail,
          })}
          isLoading={ordersIsLoading}
          meta={{ page, limit }}
        />

        <DataTablePagination
          label="orders"
          page={page}
          limit={limit}
          total={ordersData?.total ?? 0}
          limitOptions={LIMIT_OPTIONS}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </div>
      {/* End : Table & Pagination */}
    </div>
  );
}
