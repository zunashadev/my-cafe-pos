import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor?: "amber" | "green" | "red" | "blue";
  /**
   * Jika diisi:
   *  > 0  -> naik
   *  < 0  -> turun
   *  = 0  -> netral
   */
  trend?: number;
};

const ICON_COLOR_MAP = {
  amber: "border-amber-500 bg-amber-500/20 text-amber-600",
  green: "border-green-500 bg-green-500/20 text-green-600",
  red: "border-red-500 bg-red-500/20 text-red-600",
  blue: "border-blue-500 bg-blue-500/20 text-blue-600",
};

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  iconColor = "amber",
  trend,
}: KPICardProps) {
  const isUp = trend !== undefined && trend > 0;
  const isDown = trend !== undefined && trend < 0;

  return (
    <div
      className={cn(
        "w-full space-y-6 rounded-md border p-4",
        isUp && "border-green-500 bg-green-500/10",
        isDown && "border-red-500 bg-red-500/10",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className={cn("rounded-full border p-1", ICON_COLOR_MAP[iconColor])}
        >
          {icon}
        </div>
        <p className="text-xl">{title}</p>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {/* VALUE */}
          <p
            className={cn(
              "text-3xl font-medium",
              isUp && "text-green-600",
              isDown && "text-red-600",
            )}
          >
            {value}
          </p>

          {/* TREND ICON */}
          {trend !== undefined && (
            <span
              className={cn(
                "flex items-center text-sm font-medium",
                isUp && "text-green-600",
                isDown && "text-red-600",
                trend === 0 && "text-muted-foreground",
              )}
            >
              {isUp && <TrendingUp className="size-5" />}
              {isDown && <TrendingDown className="size-5" />}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
