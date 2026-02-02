"use server";

import z from "zod";
import {
  INITIAL_STATE_CREATE_TABLE_FORM,
  INITIAL_STATE_DELETE_TABLE_FORM,
  INITIAL_STATE_UPDATE_TABLE_FORM,
} from "./constants";
import { createTableSchema, updateTableSchema } from "./schemas";
import {
  CreateTableFormState,
  DeleteTableFormState,
  UpdateTableFormState,
} from "./types";
import { createClient } from "@/lib/supabase/server";

// 🔹 Create Table
export async function createTable(
  prevState: CreateTableFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_CREATE_TABLE_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = createTableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        description: fieldErrors.description ?? [],
        capacity: fieldErrors.capacity ?? [],
        status: fieldErrors.status ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Insert Table
  const { error } = await supabase.from("tables").insert({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    capacity: validatedFields.data.capacity,
    status: validatedFields.data.status,
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

// 🔹 Update Table
export async function updateTable(
  prevState: UpdateTableFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_UPDATE_TABLE_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = updateTableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        description: fieldErrors.description ?? [],
        capacity: fieldErrors.capacity ?? [],
        status: fieldErrors.status ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Update Supabase Server Client
  const supabase = await createClient();

  // 🔹 Update Table
  const { error } = await supabase
    .from("tables")
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      capacity: validatedFields.data.capacity,
      status: validatedFields.data.status,
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

// 🔹 Delete Table
export async function deleteTable(
  prevState: DeleteTableFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_DELETE_TABLE_FORM;

  // 🔹 Ambil ID dari formData
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return {
      status: "error",
      errors: {
        _form: ["Table ID is required"],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Delete Table from Supabase
  const { error } = await supabase.from("tables").delete().eq("id", id);

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
