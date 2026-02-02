"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/features/auth/actions";
import {
  INITIAL_STATE_UPDATE_USER_FORM,
  ROLE_OPTIONS,
} from "@/features/auth/constants";
import { updateUserSchema, UpdateUserSchema } from "@/features/auth/schemas";
import { Profile } from "@/features/auth/types";
import { useFilePreview } from "@/hooks/use-file-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImageIcon, Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateUserDialog({
  open,
  onOpenChange,
  refetch,
  currentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
  currentData: Profile | null;
}) {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  // 🔹 Custom Hook Preview File (Avatar)
  const {
    preview: previewAvatar,
    setFile: setFileAvatar,
    reset: resetAvatar,
    getFile: getFileAvatar,
  } = useFilePreview(currentData?.avatar_url); // initialPreview = avatar_url

  // 🔹 Use Action State Update
  const [updateUserState, updateUserAction, updateUserIsPending] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: UpdateUserSchema) {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));
    formData.append("name", data.name);
    formData.append("role", data.role);

    // Ambil Avatar & Old Avatar URL → hanya jika upload avatar baru
    const avatarFile = getFileAvatar();

    if (avatarFile) {
      formData.append("avatar", avatarFile);

      if (currentData.avatar_url)
        formData.append("old_avatar_url", currentData.avatar_url);
    }

    startTransition(() => {
      updateUserAction(formData);
    });
  }

  // 🔹 Set form | Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (open && currentData) {
      // Reset form dengan data user saat ini
      form.reset({
        name: currentData.name,
        role: currentData.role,
        avatar: undefined,
      });
    } else {
      // Modal ditutup → reset form juga
      form.reset();
      startTransition(() => {
        updateUserAction(null);
      });
    }

    resetAvatar();
  }, [open, currentData, form, resetAvatar, updateUserAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (updateUserState?.status === "error") {
      toast.error("Update User Failed", {
        description: updateUserState.errors?._form?.[0],
      });
    }

    if (updateUserState?.status === "success") {
      toast.success("Update User Success");
      onOpenChange(false);
      refetch();
    }
  }, [open, updateUserState, onOpenChange, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>Update user profile</DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <FieldGroup>
              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert name here..."
                      autoComplete="off"
                      disabled={updateUserIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Role */}
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={updateUserIsPending}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select role here..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Avatar */}
              <Controller
                name="avatar"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Avatar</FieldLabel>
                    <div className="flex items-center gap-4">
                      {/* Preview */}
                      <Avatar className="size-14 rounded-lg">
                        {previewAvatar ? (
                          <AvatarImage
                            src={previewAvatar}
                            alt="preview avatar"
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="rounded-lg">
                            <FileImageIcon className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Input */}
                      <Input
                        id={field.name}
                        type="file"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        disabled={updateUserIsPending}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || undefined;
                          field.onChange(file); // update form state
                          setFileAvatar(file); // update preview state
                        }}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldSeparator />
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={updateUserIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateUserIsPending}>
              {updateUserIsPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
