import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Profile } from "@/features/auth/types";
import DataTableDropdownAction from "@/components/shared/data-table/data-table-dropdown-action";

export function tableColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (user: Profile) => void;
  onDelete: (user: Profile) => void;
}): ColumnDef<Profile>[] {
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
      accessorKey: "name",
      header: "Name",
      meta: {
        cellClassName: "font-medium",
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      meta: {
        className: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        return (
          <span className="bg-muted rounded-md px-2 py-1 font-medium capitalize">
            {row.original.role}
          </span>
        );
      },
    },
    {
      accessorKey: "avatar_url",
      header: "Avatar",
      meta: {
        className: "text-center",
      },
      cell: ({ row }) => {
        const avatarUrl = row.getValue<string>("avatar_url");
        const name = row.original.name;

        return (
          <div className="flex justify-center">
            <Avatar className="size-10">
              <AvatarImage
                src={avatarUrl}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="font-medium uppercase">
                {name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
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
        const user = row.original;

        return (
          <div className="flex justify-center">
            <DataTableDropdownAction
              row={user}
              actions={[
                {
                  label: "Edit",
                  icon: <PencilIcon className="size-4" />,
                  onClick: () => onEdit(user),
                },
                {
                  label: "Delete",
                  icon: <Trash2Icon className="size-4 text-red-500" />,
                  variant: "destructive",
                  onClick: () => onDelete(user),
                  disabled: (row) => row.role === "admin",
                },
              ]}
            />
          </div>
        );
      },
    },
  ];
}
