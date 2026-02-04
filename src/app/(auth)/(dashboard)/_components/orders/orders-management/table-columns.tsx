import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon, ViewIcon } from "lucide-react";
import DataTableDropdownAction from "@/components/shared/data-table/data-table-dropdown-action";
import { cn } from "@/lib/utils";
import {
  Order,
  OrderStatus,
  OrderWithTableAndSummary,
} from "@/features/order/types";
import { ORDER_STATUS } from "@/features/order/constants";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/features/auth/types";
import { USER_ROLE } from "@/features/auth/constants";
import { OrderStatusBadge } from "@/components/shared/order/order-status-badge";

export function tableColumns({
  userRole,
  onUpdateOrderStatus,
  onViewDetail,
}: {
  userRole: UserRole | undefined;
  onUpdateOrderStatus: (order: Order, nextStatus: OrderStatus) => void;
  onViewDetail: (order: Order) => void;
}): ColumnDef<OrderWithTableAndSummary>[] {
  return [
    {
      id: "no",
      header: "No",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row, table }) => {
        const page = table.options.meta?.page ?? 1;
        const limit = table.options.meta?.limit ?? 10;

        return (row.index + 1 + (page - 1) * limit).toString();
      },
    },
    {
      accessorKey: "order_id",
      header: "Order ID",
      meta: {
        className: "text-start",
        cellClassName: "text-start font-medium",
      },
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      meta: {
        className: "text-start",
        cellClassName: "text-start",
      },
    },
    {
      id: "table",
      header: "Table",
      meta: {
        className: "text-start",
        cellClassName: "text-start",
      },
      cell: ({ row }) => {
        const table = row.original.tables;

        return <span className="">{table?.name}</span>;
      },
    },
    {
      id: "menus-summary",
      header: "Summary",
      meta: {
        className: "text-start w-fit",
        cellClassName: "text-start w-fit",
      },
      cell: ({ row }) => {
        const summary = row.original.summary;

        return (
          <div className="space-y-1.5 rounded-sm border p-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <div>
                  <span className="text-sm">Pending : </span>
                  <span className="text-sm">{summary?.pending}</span>
                </div>
                <div>
                  <span className="text-sm">Preparing : </span>
                  <span className="text-sm">{summary?.preparing}</span>
                </div>
                <div>
                  <span className="text-sm">Ready : </span>
                  <span className="text-sm">{summary?.ready}</span>
                </div>
              </div>

              <div className="">
                <div>
                  <span className="text-sm">Served : </span>
                  <span className="text-sm">{summary?.served}</span>
                </div>
                <div>
                  <span className="text-sm">Cancelled : </span>
                  <span className="text-sm">{summary?.cancelled}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="font-medium">
              <span>Total Item : </span>
              <span>{summary?.total_items}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as OrderStatus;

        return <OrderStatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: "text-center",
      },
      cell: ({ row }) => {
        const order = row.original;

        const actions = [];

        // Confirm
        if (userRole !== USER_ROLE.KITCHEN) {
          actions.push({
            label: "Confirm",
            icon: <PencilIcon className="size-4" />,
            onClick: () => onUpdateOrderStatus(order, ORDER_STATUS.CONFIRMED),
            hidden: () => order.status !== ORDER_STATUS.DRAFT,
          });
        }

        // Served
        if (userRole !== USER_ROLE.KITCHEN) {
          actions.push({
            label: "Served",
            icon: <PencilIcon className="size-4" />,
            onClick: () => onUpdateOrderStatus(order, ORDER_STATUS.SERVED),
            hidden: () => order.status !== ORDER_STATUS.CONFIRMED,
          });
        }

        // Paid
        if (userRole !== USER_ROLE.KITCHEN) {
          actions.push({
            label: "Paid",
            icon: <PencilIcon className="size-4" />,
            onClick: () => onUpdateOrderStatus(order, ORDER_STATUS.PAID),
            hidden: () => order.status !== ORDER_STATUS.SERVED,
          });
        }

        // Cancel
        if (userRole !== USER_ROLE.KITCHEN) {
          actions.push({
            label: "Cancel",
            icon: <Trash2Icon className="size-4" />,
            onClick: () => onUpdateOrderStatus(order, ORDER_STATUS.CANCELLED),
            hidden: () =>
              order.status !== ORDER_STATUS.DRAFT &&
              order.status !== ORDER_STATUS.CONFIRMED,
          });
        }

        // Detail
        actions.push({
          label: "Detail",
          icon: <ViewIcon className="size-4" />,
          onClick: () => onViewDetail(order),
        });

        return (
          <div className="flex justify-center">
            <DataTableDropdownAction row={order} actions={actions} />
          </div>
        );
      },
    },
  ];
}
