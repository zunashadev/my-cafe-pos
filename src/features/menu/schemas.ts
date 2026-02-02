import z from "zod";

// 🔹 Create Menu
export const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  discount: z.string().min(1, "Discount is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
      "Only JPG, PNG, WEBP files are allowed",
    ),
  is_available: z.string().min(1, "Availability is required"),
});

export type CreateMenuSchema = z.infer<typeof createMenuSchema>;

// 🔹 Update Menu
export const updateMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  discount: z.string().min(1, "Discount is required"),
  image: z
    .custom<File | undefined>()
    .refine((file) => !file || file instanceof File, "Invalid file")
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Max file size is 5MB",
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, WEBP files are allowed",
    ),
  is_available: z.string().min(1, "Availability is required"),
});

export type UpdateMenuSchema = z.infer<typeof updateMenuSchema>;
