import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { ReactNode } from "react";

export default function DataTableDropdownAction<T>({
  row,
  actions,
}: {
  row: T;
  actions: {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    variant?: "default" | "destructive";
    hidden?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
  }[];
}) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => {
          const isDisabled = action.disabled?.(row);

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(row)}
              disabled={isDisabled}
              className={cn(
                action.variant === "destructive" &&
                  "text-red-500 focus:text-red-500",
              )}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
