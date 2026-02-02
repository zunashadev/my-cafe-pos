import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(
  value: number | string,
  options?: {
    withPrefix?: boolean; // default: true -> "Rp"
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  const numberValue = typeof value === "string" ? Number(value) : value;

  if (isNaN(numberValue)) return "Rp 0";

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });

  const formatted = formatter.format(numberValue);

  if (options?.withPrefix === false) {
    return formatted.replace(/^Rp\s?/, "");
  }

  return formatted;
}
