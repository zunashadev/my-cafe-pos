import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, Trash2Icon } from "lucide-react";
import DataTableDropdownAction from "@/components/shared/data-table/data-table-dropdown-action";
import { Menu } from "@/features/menu/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function tableColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}): ColumnDef<Menu>[] {
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
      cell: ({ row }) => {
        const imageUrl = row.original.image_url;
        const name = row.original.name;

        return (
          <div className="flex gap-2">
            <div className="flex-none">
              <Image
                src={imageUrl as string}
                alt={name ?? "menu image"}
                width={1020}
                height={1020}
                className="size-32 rounded object-cover"
                loading="eager"
              />
            </div>

            <div>
              <p className="text-lg font-medium">{row.original.name}</p>
              <p className="text-wrap">{row.original.description}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        return (
          <span className="bg-muted rounded-md px-2 py-1 font-medium capitalize">
            {row.original.category}
          </span>
        );
      },
    },
    {
      id: "price",
      header: "Price",
      meta: {
        className: "text-start",
        cellClassName: "text-start",
      },
      cell: ({ row }) => {
        return (
          <div className="">
            <p>
              Base Price :{" "}
              <span className="font-medium">{row.original.price}</span>
            </p>
            <p>
              Discount :{" "}
              <span className="font-medium">{row.original.discount ?? 0}%</span>
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "is_available",
      header: "Is Available",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        const isAvailable = row.getValue<string>("is_available");

        return (
          <span
            className={cn(
              "rounded-md px-2 py-1 font-medium capitalize",
              isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white",
            )}
          >
            {isAvailable ? "Available" : "Unavailable"}
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
        const menu = row.original;

        return (
          <div className="flex justify-center">
            <DataTableDropdownAction
              row={menu}
              actions={[
                {
                  label: "Edit",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () => onEdit(menu),
                },
                {
                  label: "Delete",
                  icon: <Trash2Icon className="size-4 text-red-500" />,
                  variant: "destructive",
                  onClick: () => onDelete(menu),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];
}
