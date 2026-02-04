import { cn } from "@/lib/utils";
import { OrderStatus } from "@/features/order/types";
import { ORDER_STATUS } from "@/features/order/constants";

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

const STATUS_STYLE_MAP: Record<OrderStatus, string> = {
  [ORDER_STATUS.DRAFT]: "bg-gray-200 text-gray-800",
  [ORDER_STATUS.CONFIRMED]: "bg-blue-500 text-white",
  [ORDER_STATUS.SERVED]: "bg-purple-500 text-white",
  [ORDER_STATUS.PAID]: "bg-green-500 text-white",
  [ORDER_STATUS.CANCELLED]: "bg-red-500 text-white",
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
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
