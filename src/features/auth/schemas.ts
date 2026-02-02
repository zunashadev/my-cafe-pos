import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  role: z.string().min(1, "Role is required"),
  email: z.email().min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  avatar: z
    .any()
    .refine((file) => file instanceof File, "Avatar is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
      "Only JPG, PNG, WEBP files are allowed",
    ),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  role: z.string().min(1, "Role is required"),
  avatar: z
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
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
