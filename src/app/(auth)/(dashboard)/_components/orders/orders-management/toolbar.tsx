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
import { useState } from "react";
import { OrderStatus } from "@/features/order/types";
import { ORDER_STATUS } from "@/features/order/constants";
import CreateOrderDialog from "./dialog/create-order-dialog";
import { useAuthStore } from "@/features/auth/stores";
import { USER_ROLE } from "@/features/auth/constants";

export default function OrdersManagementToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | null;
  onStatusFilterChange: (value: OrderStatus | null) => void;
}) {
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  // 🔹 Create Order Dialog
  const [openCreateOrder, setOpenCreateOrder] = useState(false);

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
                value === "all" ? null : (value as OrderStatus),
              )
            }
          >
            <SelectTrigger className="min-w-[156px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(ORDER_STATUS).map((status) => (
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
            placeholder="Search menu..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        {profile && profile?.role !== USER_ROLE.KITCHEN && (
          <div>
            <Button onClick={() => setOpenCreateOrder(true)}>
              <PlusIcon />
              Create Order
            </Button>
            <CreateOrderDialog
              open={openCreateOrder}
              onOpenChange={setOpenCreateOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
