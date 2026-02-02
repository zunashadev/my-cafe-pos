"use client";

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
import { updateTable } from "@/features/table/actions";
import {
  INITIAL_STATE_UPDATE_TABLE_FORM,
  TABLE_STATUS,
} from "@/features/table/constants";
import { updateTableSchema, UpdateTableSchema } from "@/features/table/schemas";
import { Table } from "@/features/table/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateTableDialog({
  open,
  onOpenChange,
  currentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: Table | null;
}) {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<UpdateTableSchema>({
    resolver: zodResolver(updateTableSchema),
  });

  // 🔹 Use Action State
  const [updateTableState, updateTableAction, updateTableIsPending] =
    useActionState(updateTable, INITIAL_STATE_UPDATE_TABLE_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: UpdateTableSchema) {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("capacity", data.capacity);
    formData.append("status", data.status);

    startTransition(() => {
      updateTableAction(formData);
    });
  }

  // 🔹 Set form | Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (open && currentData) {
      // Reset form dengan data table saat ini
      form.reset({
        name: currentData.name ?? "",
        description: currentData.description ?? "",
        capacity: currentData.capacity?.toString() ?? "",
        status: currentData.status ?? "",
      });
    } else {
      // Modal ditutup → reset form juga
      form.reset();
      startTransition(() => {
        updateTableAction(null);
      });
    }
  }, [open, currentData, form, updateTableAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (updateTableState?.status === "error") {
      toast.error("Update Table Failed", {
        description: updateTableState.errors?._form?.[0],
      });
    }

    if (updateTableState?.status === "success") {
      toast.success("Update Table Success");
      onOpenChange(false);
    }
  }, [open, updateTableState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Update Table</DialogTitle>
            <DialogDescription>Update Table</DialogDescription>
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
                      disabled={updateTableIsPending}
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
                      disabled={updateTableIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Capacity */}
              <Controller
                name="capacity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert capacity here..."
                      autoComplete="off"
                      disabled={updateTableIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={updateTableIsPending}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select status here..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {Object.values(TABLE_STATUS).map((status) => (
                            <SelectItem key={status} value={status}>
                              <span className="capitalize">{status}</span>
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
                disabled={updateTableIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateTableIsPending}>
              {updateTableIsPending ? (
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
