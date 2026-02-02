"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import DataTablePagination from "@/components/shared/data-table/data-table-pagination";
import DataTable from "@/components/shared/data-table/data-table";
import { useMenus, useMenusRealtime } from "@/features/menu/hooks";
import { tableColumns } from "./table-columns";
import MenusManagementToolbar from "./toolbar";
import UpdateMenuDialog from "./dialog/update-menu-dialog";
import DeleteMenuDialog from "./dialog/delete-menu-dialog";
import { Menu } from "@/features/menu/types";
import { LIMIT_OPTIONS } from "@/constants/data-table-constant";

export default function MenusManagement() {
  // 🔹 UI States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[1]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // 🔹 Fetch Data from DB
  const { data, isLoading, isError, error, refetch } = useMenus({
    page,
    limit,
    search: useDebounce(search, 500),
    category,
  });

  // 🔹 Realtime
  useMenusRealtime(refetch);

  // 🔹 Toast Error
  useEffect(() => {
    if (isError && error) {
      toast.error("Get Menus Data Failed", {
        description: error.message,
      });
    }
  }, [isError, error]);

  // 🔹 Update & Delete Menu Dialog
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [openUpdateMenu, setOpenUpdateMenu] = useState(false);
  const [openDeleteMenu, setOpenDeleteMenu] = useState(false);

  return (
    <div className="space-y-4">
      {/* Start : Toolbar */}
      <MenusManagementToolbar
        search={search}
        categoryFilter={category}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCategoryFilterChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      />
      {/* End : Toolbar */}

      {/* Start : Table & Pagination */}
      <div className="bg-primary-foreground rounded-md border p-2">
        <DataTable
          data={data?.data ?? []}
          columns={tableColumns({
            onEdit: (menu) => {
              setSelectedMenu(menu);
              setOpenUpdateMenu(true);
            },
            onDelete: (menu) => {
              setSelectedMenu(menu);
              setOpenDeleteMenu(true);
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
          label="menus"
        />
      </div>
      {/* End : Table & Pagination */}

      {/* Start : Dialog Update & Delete */}
      <UpdateMenuDialog
        open={openUpdateMenu}
        onOpenChange={(open) => {
          setOpenUpdateMenu(open);
          if (!open) setSelectedMenu(null);
        }}
        currentData={selectedMenu}
      />

      <DeleteMenuDialog
        open={openDeleteMenu}
        onOpenChange={(open) => {
          setOpenDeleteMenu(open);
          if (!open) setSelectedMenu(null);
        }}
        currentData={selectedMenu}
      />
      {/* Start : Dialog Update & Delete */}
    </div>
  );
}
