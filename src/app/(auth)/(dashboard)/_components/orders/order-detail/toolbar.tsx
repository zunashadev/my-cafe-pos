import { Button } from "@/components/ui/button";
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
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { OrderMenuStatus } from "@/features/order/types";
import { ORDER_MENU_STATUS } from "@/features/order/constants";
import { useAuthStore } from "@/features/auth/stores";
import { USER_ROLE } from "@/features/auth/constants";
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
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);
  const role = profile?.role;

  const ORDER_ADD_PATH_BY_ROLE: Partial<Record<string, string>> = {
    [USER_ROLE.ADMIN]: `/admin/orders/${order_id}/add`,
    [USER_ROLE.CASHIER]: `/cashier/orders/${order_id}/add`,
  };

  const addOrderMenuPath = role ? ORDER_ADD_PATH_BY_ROLE[role] : undefined;

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

        {addOrderMenuPath && role !== USER_ROLE.KITCHEN && (
          <div>
            <Link href={addOrderMenuPath}>
              <Button>
                <PlusIcon />
                Add Order Menu
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
