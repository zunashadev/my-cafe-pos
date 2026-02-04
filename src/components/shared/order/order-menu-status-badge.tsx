import { cn } from "@/lib/utils";
import { OrderMenuStatus } from "@/features/order/types";
import { ORDER_MENU_STATUS } from "@/features/order/constants";

type OrderMenuStatusBadgeProps = {
  status: OrderMenuStatus;
  className?: string;
};

const STATUS_STYLE_MAP: Record<OrderMenuStatus, string> = {
  [ORDER_MENU_STATUS.PENDING]: "bg-gray-200 text-gray-800",
  [ORDER_MENU_STATUS.PREPARING]: "bg-orange-500 text-white",
  [ORDER_MENU_STATUS.READY]: "bg-blue-500 text-white",
  [ORDER_MENU_STATUS.SERVED]: "bg-green-500 text-white",
  [ORDER_MENU_STATUS.CANCELLED]: "bg-red-500 text-white",
};

export function OrderMenuStatusBadge({
  status,
  className,
}: OrderMenuStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-20 items-center justify-center rounded-md px-2 py-1 text-sm font-medium capitalize",
        STATUS_STYLE_MAP[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
