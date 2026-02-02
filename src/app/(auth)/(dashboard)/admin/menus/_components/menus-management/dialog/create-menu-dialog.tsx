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
import { createMenu } from "@/features/menu/actions";
import {
  INITIAL_CREATE_MENU_FORM,
  INITIAL_STATE_CREATE_MENU_FORM,
  MENU_CATEGORY,
} from "@/features/menu/constants";
import { createMenuSchema, CreateMenuSchema } from "@/features/menu/schemas";
import { useFilePreview } from "@/hooks/use-file-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImageIcon, Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateMenuDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<CreateMenuSchema>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: INITIAL_CREATE_MENU_FORM,
  });

  // 🔹 Custom Hook Preview File (Image)
  const {
    preview: previewImage,
    setFile: setFileImage,
    reset: resetImage,
    getFile: getFileImage,
  } = useFilePreview();

  // 🔹 Use Action State
  const [createMenuState, createMenuAction, createMenuIsPending] =
    useActionState(createMenu, INITIAL_STATE_CREATE_MENU_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: CreateMenuSchema) {
    const formData = new FormData();

    // Append field NON-file secara eksplisit
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("is_available", data.is_available);

    // Ambil file dari useFilePreview (SINGLE SOURCE OF TRUTH)
    const imageFile = getFileImage();
    if (imageFile) {
      formData.append("image", imageFile);
    }

    startTransition(() => {
      createMenuAction(formData);
    });
  }

  // 🔹 Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      form.reset();
      resetImage();
    }
  }, [open, form, resetImage]);

  useEffect(() => {
    if (createMenuState?.status === "error") {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0],
      });
    }

    if (createMenuState?.status === "success") {
      toast.success("Create Menu Success");
      onOpenChange(false);
    }
  }, [createMenuState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Create Menu</DialogTitle>
            <DialogDescription>Create a new menu</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-4 py-8">
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
                      disabled={createMenuIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert description here..."
                      autoComplete="off"
                      disabled={createMenuIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Category */}
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createMenuIsPending}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select category here..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {Object.values(MENU_CATEGORY).map((category) => (
                            <SelectItem key={category} value={category}>
                              <span className="capitalize">{category}</span>
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

              {/* Price */}
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert price here..."
                      autoComplete="off"
                      disabled={createMenuIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Discount */}
              <Controller
                name="discount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Discount</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert discount here..."
                      autoComplete="off"
                      disabled={createMenuIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              {/* Image */}
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                    <div className="flex items-center gap-4">
                      {/* Preview */}
                      <Avatar className="size-14 rounded-lg">
                        {previewImage ? (
                          <AvatarImage
                            src={previewImage}
                            alt="preview image"
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
                        disabled={createMenuIsPending}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || undefined;
                          field.onChange(file); // update form
                          setFileImage(file); // update preview
                        }}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Is Available */}
              <Controller
                name="is_available"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Is Available?</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createMenuIsPending}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select category here..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Availability</SelectLabel>
                          {["true", "false"].map((avaibility) => (
                            <SelectItem key={avaibility} value={avaibility}>
                              {avaibility}
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
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createMenuIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createMenuIsPending}>
              {createMenuIsPending ? (
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
