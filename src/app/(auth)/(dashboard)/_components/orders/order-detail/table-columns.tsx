import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import DataTableDropdownAction from "@/components/shared/data-table/data-table-dropdown-action";
import { cn, formatRupiah } from "@/lib/utils";
import { OrderMenuStatus, OrderMenuWithMenu } from "@/features/order/types";
import { ORDER_MENU_STATUS } from "@/features/order/constants";
import Image from "next/image";

export function tableColumns({
  onEdit,
  onDelete,
  onUpdateOrderMenuStatus,
}: {
  onEdit: (order: OrderMenuWithMenu) => void;
  onDelete: (order: OrderMenuWithMenu) => void;
  onUpdateOrderMenuStatus: (
    orderMenuId: string,
    nextStatus: OrderMenuStatus,
  ) => void;
}): ColumnDef<OrderMenuWithMenu>[] {
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
      id: "menu",
      header: "Menu",
      meta: {
        className: "text-start",
        cellClassName: "text-start",
      },
      cell: ({ row }) => {
        const menu = row.original.menus;

        return (
          <div className="flex items-center gap-2">
            <Image
              src={menu.image_url as string}
              alt={menu.name as string}
              width="128"
              height="128"
              className="h-32 w-32 rounded object-cover"
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">
                {menu.name} x {row.original.quantity}
              </span>
              <span className="text-muted-foreground text-sm">
                {row.original.notes || "No Notes"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "price",
      header: "Price",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        const menuPrice = row.original.menus.price ?? 0;
        const menuQuantity = row.original.quantity ?? 0;

        const totalPrice = menuPrice * menuQuantity;

        return <div>{formatRupiah(totalPrice)}</div>;
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
        const status = row.getValue("status") as OrderMenuStatus;

        return (
          <span
            className={cn("rounded-md px-2 py-1 font-medium capitalize", {
              "bg-gray-200 text-gray-800": status === ORDER_MENU_STATUS.PENDING,
              "bg-orange-500 text-white":
                status === ORDER_MENU_STATUS.PREPARING,
              "bg-blue-500 text-white": status === ORDER_MENU_STATUS.READY,
              "bg-green-500 text-white": status === ORDER_MENU_STATUS.SERVED,
              "bg-red-500 text-white": status === ORDER_MENU_STATUS.CANCELLED,
            })}
          >
            {status}
          </span>
        );
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
        const orderMenu = row.original;

        return (
          <div className="flex justify-center">
            <DataTableDropdownAction
              row={orderMenu}
              actions={[
                {
                  label: "Preparing",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () =>
                    onUpdateOrderMenuStatus(
                      orderMenu.id as string,
                      ORDER_MENU_STATUS.PREPARING,
                    ),
                  hidden: () => orderMenu.status !== ORDER_MENU_STATUS.PENDING,
                },
                {
                  label: "Ready",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () =>
                    onUpdateOrderMenuStatus(
                      orderMenu.id as string,
                      ORDER_MENU_STATUS.READY,
                    ),
                  hidden: () =>
                    orderMenu.status !== ORDER_MENU_STATUS.PREPARING,
                },
                {
                  label: "Served",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () =>
                    onUpdateOrderMenuStatus(
                      orderMenu.id as string,
                      ORDER_MENU_STATUS.SERVED,
                    ),
                  hidden: () => orderMenu.status !== ORDER_MENU_STATUS.READY,
                },
                {
                  label: "Cancel",
                  icon: <Trash2Icon className="size-4" />,
                  onClick: () =>
                    onUpdateOrderMenuStatus(
                      orderMenu.id as string,
                      ORDER_MENU_STATUS.CANCELLED,
                    ),
                  hidden: () =>
                    orderMenu.status !== ORDER_MENU_STATUS.PENDING &&
                    orderMenu.status !== ORDER_MENU_STATUS.PREPARING,
                },
              ]}
            />
          </div>
        );
      },
    },
  ];
}
