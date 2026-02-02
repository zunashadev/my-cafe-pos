"use client";

import { useProfiles } from "@/features/auth/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UsersManagementToolbar from "./toolbar";
import { useDebounce } from "@/hooks/use-debounce";
import DataTablePagination from "@/components/shared/data-table/data-table-pagination";
import DataTable from "@/components/shared/data-table/data-table";
import { tableColumns } from "./table-columns";
import { Profile } from "@/features/auth/types";
import UpdateUserDialog from "./dialog/update-user-dialog";
import DeleteUserDialog from "./dialog/delete-user-dialog";
import { LIMIT_OPTIONS } from "@/constants/data-table-constant";

export default function UsersManagement() {
  // 🔹 UI States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[1]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | null>(null);

  // 🔹 Fetch Data from DB
  const { data, isLoading, isError, error, refetch } = useProfiles({
    page,
    limit,
    search: useDebounce(search, 500),
    role,
  });

  // 🔹 Toast Error
  useEffect(() => {
    if (isError && error) {
      toast.error("Get Users Data Failed", {
        description: error.message,
      });
    }
  }, [isError, error]);

  // 🔹 Update & Delete User Dialog
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  return (
    <div className="space-y-4">
      {/* Start : Toolbar */}
      <UsersManagementToolbar
        search={search}
        roleFilter={role}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onRoleChange={(value) => {
          setRole(value);
          setPage(1);
        }}
        refetch={refetch}
      />
      {/* End : Toolbar */}

      {/* Start : Table & Pagination */}
      <div className="bg-primary-foreground rounded-md border p-2">
        <DataTable
          data={data?.data ?? []}
          columns={tableColumns({
            onEdit: (user) => {
              setSelectedUser(user);
              setOpenUpdateUser(true);
            },
            onDelete: (user) => {
              setSelectedUser(user);
              setOpenDeleteUser(true);
            },
          })}
          isLoading={isLoading}
          meta={{ page, limit }}
        />

        <DataTablePagination
          page={page}
          limit={limit}
          total={data?.total ?? 0}
          limitOptions={LIMIT_OPTIONS}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          label="users"
        />
      </div>
      {/* End : Table & Pagination */}

      {/* Start : Dialog Update & Delete */}
      <UpdateUserDialog
        open={openUpdateUser}
        onOpenChange={(open) => {
          setOpenUpdateUser(open);
          if (!open) setSelectedUser(null);
        }}
        refetch={refetch}
        currentData={selectedUser}
      />

      <DeleteUserDialog
        open={openDeleteUser}
        onOpenChange={(open) => {
          setOpenDeleteUser(open);
          if (!open) setSelectedUser(null);
        }}
        refetch={refetch}
        currentData={selectedUser}
      />
      {/* Start : Dialog Update & Delete */}
    </div>
  );
}
