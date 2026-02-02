import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TABLE_STATUS } from "@/features/table/constants";
import { TableStatus } from "@/features/table/types";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CreateTableDialog from "./dialog/create-table-dialog";
// import CreateMenuDialog from "./dialog/create-menu-dialog";
// import CreateUserDialog from "./dialog/create-user-dialog";

export default function TablesManagementToolbar({
  search,
  onSearchChange,
  capacityFilter,
  onCapacityFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  capacityFilter: number | null;
  onCapacityFilterChange: (value: number | null) => void;
  statusFilter: TableStatus | null;
  onStatusFilterChange: (value: TableStatus | null) => void;
}) {
  // 🔹 Create Table Dialog
  const [openCreateTable, setOpenCreateTable] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span>Status</span>
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) =>
              onStatusFilterChange(
                value === "all" ? null : (value as TableStatus),
              )
            }
          >
            <SelectTrigger className="min-w-[156px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(TABLE_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Capacity Filter */}
        <div className="flex items-center gap-2">
          <span>Capacity</span>
          <Input
            type="number"
            min={1}
            placeholder="All Capacity"
            value={capacityFilter ?? ""}
            onChange={(e) =>
              onCapacityFilterChange(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="w-32"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search menu..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div>
          <Button onClick={() => setOpenCreateTable(true)}>
            <PlusIcon />
            Create Table
          </Button>
          <CreateTableDialog
            open={openCreateTable}
            onOpenChange={setOpenCreateTable}
          />
        </div>
      </div>
    </div>
  );
}
