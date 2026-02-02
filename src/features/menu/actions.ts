"use server";

import z from "zod";
import {
  INITIAL_STATE_CREATE_MENU_FORM,
  INITIAL_STATE_DELETE_MENU_FORM,
  INITIAL_STATE_UPDATE_MENU_FORM,
} from "./constants";
import { createMenuSchema, updateMenuSchema } from "./schemas";
import {
  CreateMenuFormState,
  DeleteMenuFormState,
  UpdateMenuFormState,
} from "./types";
import { createClient } from "@/lib/supabase/server";
import { deleteFile, uploadFile } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

// 🔹 Create Menu
export async function createMenu(
  prevState: CreateMenuFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_CREATE_MENU_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = createMenuSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    image: formData.get("image"),
    is_available: formData.get("is_available"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        description: fieldErrors.description ?? [],
        category: fieldErrors.category ?? [],
        price: fieldErrors.price ?? [],
        discount: fieldErrors.discount ?? [],
        image: fieldErrors.image ?? [],
        is_available: fieldErrors.is_available ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Handle Image Upload
  let imageUrl: string | undefined;

  if (validatedFields.data.image && validatedFields.data.image.size > 0) {
    const uploadResult = await uploadFile({
      bucket: "images",
      folder: "menus",
      file: validatedFields.data.image,
    });

    if (!uploadResult.success) {
      return {
        status: "error",
        errors: {
          image: [uploadResult.error],
          _form: [],
        },
      };
    }

    imageUrl = uploadResult.data.url;
  }

  // 🔹 Insert Menu
  const { error } = await supabase.from("menus").insert({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    category: validatedFields.data.category,
    price: validatedFields.data.price,
    discount: validatedFields.data.discount,
    image_url: imageUrl,
    is_available: validatedFields.data.is_available,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

// 🔹 Update Menu
export async function updateMenu(
  prevState: UpdateMenuFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_UPDATE_MENU_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = updateMenuSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    image: formData.get("image"),
    is_available: formData.get("is_available"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    console.log(fieldErrors);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        description: fieldErrors.description ?? [],
        category: fieldErrors.category ?? [],
        price: fieldErrors.price ?? [],
        discount: fieldErrors.discount ?? [],
        image: fieldErrors.image ?? [],
        is_available: fieldErrors.is_available ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Update Supabase Server Client
  const supabase = await createClient();

  // 🔹 Handle Image Upload
  let imageUrl: string | undefined;

  if (validatedFields.data.image && validatedFields.data.image.size > 0) {
    const oldImageUrl = formData.get("old_image_url");

    const prevPath =
      typeof oldImageUrl === "string"
        ? oldImageUrl.split("/images/")[1]
        : undefined;

    const uploadResult = await uploadFile({
      bucket: "images",
      folder: "menus",
      file: validatedFields.data.image,
      prevPath,
    });

    if (!uploadResult.success) {
      return {
        status: "error",
        errors: {
          image: [uploadResult.error],
          _form: [],
        },
      };
    }

    imageUrl = uploadResult.data.url;
  }

  // 🔹 Update Menu
  const { error } = await supabase
    .from("menus")
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      category: validatedFields.data.category,
      price: validatedFields.data.price,
      discount: validatedFields.data.discount,
      ...(imageUrl && { image_url: imageUrl }),
      is_available: validatedFields.data.is_available,
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

// 🔹 Delete Menu
export async function deleteMenu(
  prevState: DeleteMenuFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_DELETE_MENU_FORM;

  // 🔹 Ambil ID dari formData
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return {
      status: "error",
      errors: {
        _form: ["User ID is required"],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Delete Menu dari Supabase
  const { error } = await supabase.from("menus").delete().eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  // 🔹 Delete Image
  const imageUrl = formData.get("image_url");

  if (imageUrl) {
    const imagePath =
      typeof imageUrl === "string" ? imageUrl.split("/images/")[1] : undefined;

    if (imagePath) {
      const deleteResult = await deleteFile({
        bucket: "images",
        path: imagePath,
      });

      if (!deleteResult.success) {
        return {
          status: "error",
          errors: {
            _form: [deleteResult.error ?? "Unknown error"],
          },
        };
      }
    }
  }

  return {
    status: "success",
  };
}
