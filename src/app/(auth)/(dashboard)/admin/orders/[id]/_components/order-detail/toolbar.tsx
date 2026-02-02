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
import Link from "next/link";
import { OrderMenuStatus } from "@/features/order/types";
import { ORDER_MENU_STATUS } from "@/features/order/constants";
import { useRouter } from "next/navigation";
// import CreateMenuDialog from "./dialog/create-menu-dialog";
// import CreateUserDialog from "./dialog/create-user-dialog";

export default function OrderDetailToolbar({
  order_id,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  refetch,
}: {
  order_id: string;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderMenuStatus | null;
  onStatusFilterChange: (value: OrderMenuStatus | null) => void;
  refetch: () => void;
}) {
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
                value === "all" ? null : (value as OrderMenuStatus),
              )
            }
          >
            <SelectTrigger className="min-w-[156px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(ORDER_MENU_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order menu..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div>
          <Link href={`/admin/orders/${order_id}/add`}>
            <Button>
              <PlusIcon />
              Add Order Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
