// ! penting untuk extend meta di react table

// ini untuk handle error eslint -> memperbolehkan unused var khusus untuk file ini
/* eslint-disable @typescript-eslint/no-unused-vars */

import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // 🔹 Meta khusus untuk kolom
  interface ColumnMeta<TData, TValue> {
    className?: string;
    cellClassName?: string;
  }
  // 🔹 Meta khusus untuk table (misalnya pagination)
  interface TableMeta<TData = unknown> {
    page?: number;
    limit?: number;
  }
}
