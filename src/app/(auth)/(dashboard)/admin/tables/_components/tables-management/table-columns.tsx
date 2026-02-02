import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import DataTableDropdownAction from "@/components/shared/data-table/data-table-dropdown-action";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Table, TableStatus } from "@/features/table/types";
import { TABLE_STATUS } from "@/features/table/constants";

export function tableColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
}): ColumnDef<Table>[] {
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
      id: "table",
      header: "Table",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-lg font-medium">{row.original.name}</p>
            <p className="text-wrap">{row.original.description}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
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
        const status = row.getValue("status") as TableStatus;

        return (
          <span
            className={cn("rounded-md px-2 py-1 font-medium capitalize", {
              "bg-green-500 text-white": status === TABLE_STATUS.AVAILABLE,
              "bg-yellow-500 text-white": status === TABLE_STATUS.RESERVED,
              "bg-red-500 text-white": status === TABLE_STATUS.OCCUPIED,
              "bg-gray-500 text-white": status === TABLE_STATUS.MAINTENANCE,
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
        const table = row.original;

        return (
          <div className="flex justify-center">
            <DataTableDropdownAction
              row={table}
              actions={[
                {
                  label: "Edit",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () => onEdit(table),
                },
                {
                  label: "Delete",
                  icon: <Trash2Icon className="size-4 text-red-500" />,
                  variant: "destructive",
                  onClick: () => onDelete(table),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];
}
