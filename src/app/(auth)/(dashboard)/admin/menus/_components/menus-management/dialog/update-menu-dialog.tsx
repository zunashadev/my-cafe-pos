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
import { updateMenu } from "@/features/menu/actions";
import {
  INITIAL_STATE_UPDATE_MENU_FORM,
  MENU_CATEGORY,
} from "@/features/menu/constants";
import { updateMenuSchema, UpdateMenuSchema } from "@/features/menu/schemas";
import { Menu } from "@/features/menu/types";
import { useFilePreview } from "@/hooks/use-file-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImageIcon, Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateMenuDialog({
  open,
  onOpenChange,
  currentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: Menu | null;
}) {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<UpdateMenuSchema>({
    resolver: zodResolver(updateMenuSchema),
  });

  // 🔹 Custom Hook Preview File (Image)
  const {
    preview: previewImage,
    setFile: setFileImage,
    reset: resetImage,
    getFile: getFileImage,
  } = useFilePreview(currentData?.image_url);

  // 🔹 Use Action State
  const [updateMenuState, updateMenuAction, updateMenuIsPending] =
    useActionState(updateMenu, INITIAL_STATE_UPDATE_MENU_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: UpdateMenuSchema) {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("is_available", data.is_available);

    // Ambil Image & Old Image URL → hanya jika upload Image baru
    const imageFile = getFileImage();

    if (imageFile) {
      formData.append("image", imageFile);

      if (currentData.image_url)
        formData.append("old_image_url", currentData.image_url);
    }

    startTransition(() => {
      updateMenuAction(formData);
    });
  }

  // 🔹 Set form | Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (open && currentData) {
      // Reset form dengan data menu saat ini
      form.reset({
        name: currentData.name ?? "",
        description: currentData.description ?? "",
        category: currentData.category ?? "",
        price: currentData.price?.toString() ?? "",
        discount: currentData.discount?.toString() ?? "",
        is_available: currentData.is_available?.toString() ?? "",
        image: undefined,
      });
    } else {
      // Modal ditutup → reset form juga
      form.reset();
      startTransition(() => {
        updateMenuAction(null);
      });
    }

    resetImage();
  }, [open, currentData, form, resetImage, updateMenuAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (updateMenuState?.status === "error") {
      toast.error("Update Menu Failed", {
        description: updateMenuState.errors?._form?.[0],
      });
    }

    if (updateMenuState?.status === "success") {
      toast.success("Update Menu Success");
      onOpenChange(false);
    }
  }, [open, updateMenuState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Update Menu</DialogTitle>
            <DialogDescription>Update menu</DialogDescription>
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
                      disabled={updateMenuIsPending}
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
                      disabled={updateMenuIsPending}
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
                      disabled={updateMenuIsPending}
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
                      disabled={updateMenuIsPending}
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
                      disabled={updateMenuIsPending}
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
                        disabled={updateMenuIsPending}
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
                      disabled={updateMenuIsPending}
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
                disabled={updateMenuIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateMenuIsPending}>
              {updateMenuIsPending ? (
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
