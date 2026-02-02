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
import { createUser } from "@/features/auth/actions";
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER_FORM,
  ROLE_OPTIONS,
} from "@/features/auth/constants";
import { createUserSchema, CreateUserSchema } from "@/features/auth/schemas";
import { useFilePreview } from "@/hooks/use-file-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImageIcon, Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateUserDialog({
  open,
  onOpenChange,
  refetch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}) {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  // 🔹 Custom Hook Preview File (Avatar)
  const {
    preview: previewAvatar,
    setFile: setFileAvatar,
    reset: resetAvatar,
    getFile: getFileAvatar,
  } = useFilePreview();

  // 🔹 Use Action State
  const [createUserState, createUserAction, createUserIsPending] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: CreateUserSchema) {
    const formData = new FormData();

    // Append field NON-file secara eksplisit
    formData.append("name", data.name);
    formData.append("role", data.role);
    formData.append("email", data.email);
    formData.append("password", data.password);

    // Ambil file dari useFilePreview (SINGLE SOURCE OF TRUTH)
    const avatarFile = getFileAvatar();
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    startTransition(() => {
      createUserAction(formData);
    });
  }

  // 🔹 Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      form.reset();
      resetAvatar();
    }
  }, [open, form, resetAvatar]);

  useEffect(() => {
    if (createUserState?.status === "error") {
      toast.error("Create User Failed", {
        description: createUserState.errors?._form?.[0],
      });
    }

    if (createUserState?.status === "success") {
      toast.success("Create User Success");
      onOpenChange(false);
      refetch();
    }
  }, [createUserState, refetch, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Register a new user</DialogDescription>
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
                      disabled={createUserIsPending}
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
                      disabled={createUserIsPending}
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
                        disabled={createUserIsPending}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || undefined;
                          field.onChange(file); // update form
                          setFileAvatar(file); // update preview
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

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert email here..."
                      autoComplete="off"
                      disabled={createUserIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="Insert password here..."
                      autoComplete="off"
                      disabled={createUserIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createUserIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createUserIsPending}>
              {createUserIsPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
