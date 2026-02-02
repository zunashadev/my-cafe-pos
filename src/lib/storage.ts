"use server";

import { environment } from "@/config/environment";
import { createClient } from "@/lib/supabase/server";

type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function getPublicUrl(bucket: string, path: string) {
  return `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * 🔹 Upload file ke Supabase Storage
 * - support create & update
 * - return { path, url }
 */
export async function uploadFile({
  bucket,
  folder,
  file,
  prevPath,
}: {
  bucket: string;
  folder: string;
  file: File;
  prevPath?: string;
}): Promise<StorageResult<{ path: string; url: string }>> {
  const supabase = await createClient();

  try {
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `${folder}/${filename}`;

    // 🔹 Delete old file if update
    if (prevPath) {
      const { error } = await supabase.storage.from(bucket).remove([prevPath]);

      if (error) {
        console.warn(
          "[storage] failed to delete previous file:",
          error.message,
        );
      }
    }

    // 🔹 Upload
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        path,
        url: getPublicUrl(bucket, path),
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}

/**
 * 🔹 Delete file
 */
export async function deleteFile({
  bucket,
  path,
}: {
  bucket: string;
  path: string;
}): Promise<StorageResult<void>> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}
