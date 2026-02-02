"use server";

import { createClient } from "@/lib/supabase/server";
import { createUserSchema, loginSchema, updateUserSchema } from "./schemas";
import {
  CreateUserFormState,
  DeleteUserFormState,
  LoginFormState,
  UpdateUserFormState,
} from "./types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import z from "zod";
import {
  INITIAL_STATE_CREATE_USER_FORM,
  INITIAL_STATE_DELETE_USER_FORM,
  INITIAL_STATE_LOGIN_FORM,
  INITIAL_STATE_UPDATE_USER_FORM,
} from "./constants";
import { deleteFile, uploadFile } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

// 🔹 Login
export async function login(
  prevState: LoginFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State -> state di useActionState adalah milik server action, jadi reset dilakukan disini
  if (!formData) return INITIAL_STATE_LOGIN_FORM;

  // 🔹 Validasi menggunakan Zod (validasi ulang di 'server' menggunakan schema yg sama dgn 'client')
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        email: fieldErrors.email ?? [],
        password: fieldErrors.password ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Login Supabase
  const { error, data } = await supabase.auth.signInWithPassword(
    validatedFields.data,
  );

  if (error) {
    return {
      status: "error",
      errors: {
        email: [],
        password: [],
        _form: [error.message],
      },
    };
  }

  // 🔹 Ambil Profile User
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // 🔹 Simpan Profile ke Cookie
  if (profile) {
    const cookiesStore = await cookies();

    cookiesStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // 🔹 Get Redirect Path by Role
  function getRedirectPathByRole(role?: string) {
    switch (role) {
      case "admin":
        return "/admin";
      case "cashier":
        return "/cashier";
      case "kitchen":
        return "/kitchen";
      default:
        return "/";
    }
  }

  // 🔹 Revalidate Cache -> refresh data SSR, sinkron session & UI
  revalidatePath("/", "layout");

  // 🔹 Redirect
  const redirectPath = getRedirectPathByRole(profile?.role);
  redirect(redirectPath);
}

// 🔹 Logout
export async function logout() {
  const supabase = await createClient();
  const cookiesStore = await cookies();

  // 🔹 Hapus session Supabase
  await supabase.auth.signOut();

  // 🔹 Hapus cookie custom
  cookiesStore.delete("user_profile");

  // 🔹 Revalidate UI yang tergantung auth
  revalidatePath("/", "layout");

  // 🔹 Redirect
  redirect("/login");
}

// 🔹 Create User
export async function createUser(
  prevState: CreateUserFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_CREATE_USER_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = createUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    avatar: formData.get("avatar"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        role: fieldErrors.role ?? [],
        avatar: fieldErrors.avatar ?? [],
        email: fieldErrors.email ?? [],
        password: fieldErrors.password ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Handle Avatar Upload
  let avatarUrl: string | undefined;

  if (validatedFields.data.avatar && validatedFields.data.avatar.size > 0) {
    const uploadResult = await uploadFile({
      bucket: "images",
      folder: "users",
      file: validatedFields.data.avatar,
    });

    if (!uploadResult.success) {
      return {
        status: "error",
        errors: {
          avatar: [uploadResult.error],
          _form: [],
        },
      };
    }

    avatarUrl = uploadResult.data.url;
  }

  // 🔹 Sign Up User
  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: avatarUrl,
      },
    },
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

// 🔹 Update User
export async function updateUser(
  prevState: UpdateUserFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_UPDATE_USER_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = updateUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    avatar: formData.get("avatar"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        name: fieldErrors.name ?? [],
        role: fieldErrors.role ?? [],
        avatar: fieldErrors.avatar ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Handle Avatar Upload
  let avatarUrl: string | undefined;

  if (validatedFields.data.avatar && validatedFields.data.avatar.size > 0) {
    const oldAvatarUrl = formData.get("old_avatar_url");

    const prevPath =
      typeof oldAvatarUrl === "string"
        ? oldAvatarUrl.split("/images/")[1]
        : undefined;

    const uploadResult = await uploadFile({
      bucket: "images",
      folder: "users",
      file: validatedFields.data.avatar,
      prevPath,
    });

    if (!uploadResult.success) {
      return {
        status: "error",
        errors: {
          avatar: [uploadResult.error],
          _form: [],
        },
      };
    }

    avatarUrl = uploadResult.data.url;
  }

  // 🔹 Update User
  const { error } = await supabase
    .from("profiles")
    .update({
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      ...(avatarUrl && { avatar_url: avatarUrl }),
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

// 🔹 Delete User
export async function deleteUser(
  prevState: DeleteUserFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_DELETE_USER_FORM;

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
  const supabase = await createAdminClient();

  // 🔹 Delete User dari auth.users
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  // 🔹 Delete Avatar
  const avatarUrl = formData.get("avatar_url");

  if (avatarUrl) {
    const avatarPath =
      typeof avatarUrl === "string"
        ? avatarUrl.split("/images/")[1]
        : undefined;

    if (avatarPath) {
      const deleteResult = await deleteFile({
        bucket: "images",
        path: avatarPath,
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
