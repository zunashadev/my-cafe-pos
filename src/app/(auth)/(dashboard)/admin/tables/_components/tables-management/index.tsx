"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import DataTablePagination from "@/components/shared/data-table/data-table-pagination";
import DataTable from "@/components/shared/data-table/data-table";
import { useTables, useTablesRealtime } from "@/features/table/hooks";
import { Table, TableStatus } from "@/features/table/types";
import { tableColumns } from "./table-columns";
import TablesManagementToolbar from "./toolbar";
import UpdateTableDialog from "./dialog/update-table-dialog";
import DeleteTableDialog from "./dialog/delete-table-dialog";
import { LIMIT_OPTIONS } from "@/constants/data-table-constant";

export default function TablesManagement() {
  // 🔹 UI States
  // Page
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[0]);
  const [search, setSearch] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [status, setStatus] = useState<TableStatus | null>(null);

  // 🔹 Fetch Data from DB
  const { data, isLoading, isError, error, refetch } = useTables({
    page,
    limit,
    search: useDebounce(search, 500),
    capacity,
    status,
  });

  // 🔹 Realtime
  useTablesRealtime(refetch);

  // 🔹 Toast Error
  useEffect(() => {
    if (isError && error) {
      toast.error("Get Tables Data Failed", {
        description: error.message,
      });
    }
  }, [isError, error]);

  // 🔹 Update & Delete Table Dialog
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [openUpdateTable, setOpenUpdateTable] = useState(false);
  const [openDeleteTable, setOpenDeleteTable] = useState(false);

  return (
    <div className="space-y-4">
      {/* Start : Toolbar */}
      <TablesManagementToolbar
        search={search}
        capacityFilter={capacity}
        statusFilter={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusFilterChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onCapacityFilterChange={(value) => {
          setCapacity(value);
          setPage(1);
        }}
      />
      {/* End : Toolbar */}

      {/* Start : Table & Pagination */}
      <div className="bg-primary-foreground rounded-md border p-2">
        <DataTable
          data={data?.data ?? []}
          columns={tableColumns({
            onEdit: (table) => {
              setSelectedTable(table);
              setOpenUpdateTable(true);
            },
            onDelete: (table) => {
              setSelectedTable(table);
              setOpenDeleteTable(true);
            },
          })}
          isLoading={isLoading}
          meta={{ page, limit }}
        />

        <DataTablePagination
          label="tables"
          page={page}
          limit={limit}
          total={data?.total ?? 0}
          limitOptions={LIMIT_OPTIONS}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </div>
      {/* End : Table & Pagination */}

      {/* Start : Dialog Update & Delete */}
      <UpdateTableDialog
        open={openUpdateTable}
        onOpenChange={(open) => {
          setOpenUpdateTable(open);
          if (!open) setSelectedTable(null);
        }}
        currentData={selectedTable}
      />

      <DeleteTableDialog
        open={openDeleteTable}
        onOpenChange={(open) => {
          setOpenDeleteTable(open);
          if (!open) setSelectedTable(null);
        }}
        currentData={selectedTable}
      />
      {/* Start : Dialog Update & Delete */}
    </div>
  );
}
