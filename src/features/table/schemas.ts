import z from "zod";

// 🔹 Create Table
export const createTableSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.string().min(1, "capacity is required"),
  status: z.string().min(1, "Status is required"),
});

export type CreateTableSchema = z.infer<typeof createTableSchema>;

// 🔹 Update Table
export const updateTableSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.string().min(1, "capacity is required"),
  status: z.string().min(1, "Status is required"),
});

export type UpdateTableSchema = z.infer<typeof updateTableSchema>;
