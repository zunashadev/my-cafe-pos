"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import OrderDetailToolbar from "./toolbar";
import { LIMIT_OPTIONS } from "@/constants/data-table-constant";
import { OrderMenuStatus, OrderMenuWithMenu } from "@/features/order/types";
import { useOrder, useOrderMenus } from "@/features/order/hooks";
import { toast } from "sonner";
import DataTable from "@/components/shared/data-table/data-table";
import { tableColumns } from "./table-columns";
import DataTablePagination from "@/components/shared/data-table/data-table-pagination";
import Summary from "./summary";
import { updateOrderMenuStatus } from "@/features/order/actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderDetail({ order_id }: { order_id: string }) {
  // 🔹 Fetch Order Detail from DB
  const {
    data: orderData,
    isLoading: orderIsLoading,
    isError: orderIsError,
    error: orderError,
    refetch: orderRefetch,
  } = useOrder(order_id);

  // 🔹 Toast Error for Fetch Order Detail
  useEffect(() => {
    if (orderIsError && orderError) {
      toast.error("Get Order Detail Failed", {
        description: orderError.message,
      });
    }
  }, [orderIsError, orderError]);

  // 🔹 UI States for Order Menus
  const [orderMenusPage, setOrderMenusPage] = useState(1);
  const [orderMenusLimit, setOrderMenusLimit] = useState(LIMIT_OPTIONS[0]);
  const [orderMenusSearch, setOrderMenusSearch] = useState("");
  const [orderMenusStatus, setOrderMenusStatus] =
    useState<OrderMenuStatus | null>(null);

  // 🔹 Fetch Order Menus from DB
  const {
    data: orderMenusData,
    isLoading: orderMenusIsLoading,
    isError: orderMenusIsError,
    error: orderMenusError,
    refetch: orderMenusRefetch,
  } = useOrderMenus({
    order_id: orderData?.order_id,
    page: orderMenusPage,
    limit: orderMenusLimit,
    search: orderMenusSearch,
    status: orderMenusStatus,
  });

  // 🔹 Toast Error for Fetch Order Menus
  useEffect(() => {
    if (orderMenusIsError && orderMenusError) {
      toast.error("Get Order Menus Failed", {
        description: orderMenusError.message,
      });
    }
  }, [orderMenusIsError, orderMenusError]);

  // 🔹 Manage Row State
  const [selectedTable, setSelectedTable] = useState<OrderMenuWithMenu | null>(
    null,
  );
  const [openUpdateTable, setOpenUpdateTable] = useState(false);
  const [openDeleteTable, setOpenDeleteTable] = useState(false);

  // 🔹 Handle Update Status
  const [
    updateOrderMenuStatusState,
    updateOrderMenuStatusAction,
    updateOrderMenuStatusIsPending,
  ] = useActionState(updateOrderMenuStatus, INITIAL_STATE_ACTION);

  const handleUpdateOrderMenuStatus = async (
    orderMenuId: string,
    nextStatus: OrderMenuStatus,
  ) => {
    if (!orderMenuId || !nextStatus) {
      return console.log("Order Menu ID or Order Menu Status  not found");
    }

    const formData = new FormData();

    formData.append("id", orderMenuId);
    formData.append("status", nextStatus);

    startTransition(() => {
      updateOrderMenuStatusAction(formData);
    });
  };

  useEffect(() => {
    if (updateOrderMenuStatusState?.status === "error") {
      toast.error("Update Order Menu Status Failed", {
        description: updateOrderMenuStatusState.errors?._form?.[0],
      });
    }

    if (updateOrderMenuStatusState?.status === "success") {
      toast.success("Update Order Menu Status Success");

      orderMenusRefetch();
    }
  }, [updateOrderMenuStatusState, orderMenusRefetch]);

  return (
    <div className="space-y-4">
      {/* Start : Toolbar */}
      <OrderDetailToolbar
        order_id={order_id}
        search={orderMenusSearch}
        onSearchChange={(value) => {
          setOrderMenusSearch(value);
          setOrderMenusPage(1);
        }}
        statusFilter={orderMenusStatus}
        onStatusFilterChange={(value) => {
          setOrderMenusStatus(value);
          setOrderMenusPage(1);
        }}
        refetch={orderMenusRefetch}
      />
      {/* End : Toolbar */}

      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="lg:w-2/3">
          {/* Start : Table & Pagination */}
          <div className="bg-primary-foreground rounded-md border p-2">
            <DataTable
              data={orderMenusData?.data ?? []}
              columns={tableColumns({
                onEdit: (table) => {
                  setSelectedTable(table);
                  setOpenUpdateTable(true);
                },
                onDelete: (table) => {
                  setSelectedTable(table);
                  setOpenDeleteTable(true);
                },
                onUpdateOrderMenuStatus: handleUpdateOrderMenuStatus,
              })}
              isLoading={orderMenusIsLoading}
              meta={{ page: orderMenusPage, limit: orderMenusLimit }}
            />

            <DataTablePagination
              label="order menus"
              page={orderMenusPage}
              limit={orderMenusLimit}
              total={orderMenusData?.total ?? 0}
              limitOptions={LIMIT_OPTIONS}
              onPageChange={setOrderMenusPage}
              onLimitChange={(newLimit) => {
                setOrderMenusLimit(newLimit);
                setOrderMenusPage(1);
              }}
            />
          </div>
          {/* End : Table & Pagination */}
        </div>

        {/* Start : Summary */}
        <div className="lg:w-1/3">
          <Summary
            order_id={order_id}
            order={orderData}
            orderMenu={orderMenusData?.data}
          />
        </div>
        {/* End : Summary */}
      </div>
    </div>
  );
}
