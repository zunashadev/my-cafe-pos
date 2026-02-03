import z from "zod";

// 🔹 Create Order
export const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  table_id: z.string().min(1, "Select a table"),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
