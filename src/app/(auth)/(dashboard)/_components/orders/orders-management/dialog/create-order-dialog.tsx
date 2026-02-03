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
import { createOrder } from "@/features/order/actions";
import {
  INITIAL_CREATE_ORDER_FORM,
  INITIAL_STATE_CREATE_ORDER_FORM,
  ORDER_STATUS,
} from "@/features/order/constants";
import { CreateOrderSchema, createOrderSchema } from "@/features/order/schemas";
import { TABLE_STATUS } from "@/features/table/constants";
import { useTables, useTablesRealtime } from "@/features/table/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // 🔹 Fetch Data Tables from DB
  const {
    data: dataTables,
    isLoading: isLoadingTables,
    isError: isErrorTables,
    error: errorTables,
    refetch: refetchTables,
  } = useTables({});

  useTablesRealtime(refetchTables);

  const queryClient = useQueryClient();

  // 🔹 Client Validation - React Hook Form
  const form = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: INITIAL_CREATE_ORDER_FORM,
  });

  // 🔹 Use Action State
  const [createOrderState, createOrderAction, createOrderIsPending] =
    useActionState(createOrder, INITIAL_STATE_CREATE_ORDER_FORM);

  // 🔹 Submit Form
  async function onSubmit(data: CreateOrderSchema) {
    const formData = new FormData();

    formData.append("customer_name", data.customer_name);
    formData.append("table_id", data.table_id);

    startTransition(() => {
      createOrderAction(formData);
    });
  }

  // 🔹 Reset Form + Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (createOrderState?.status === "error") {
      toast.error("Create Order Failed", {
        description: createOrderState.errors?._form?.[0],
      });
    }

    if (createOrderState?.status === "success") {
      toast.success("Create Order Success");

      // 🔥 invalidate tables cache -> update data tables di komponen yang tidak re amount
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      onOpenChange(false);
    }
  }, [createOrderState, onOpenChange, queryClient]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>Create a new order</DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <FieldGroup>
              {/* Customer Name */}
              <Controller
                name="customer_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Customer Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Insert customer name here..."
                      autoComplete="off"
                      disabled={createOrderIsPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Table */}
              <Controller
                name="table_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Table</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createOrderIsPending}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select table here..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Table</SelectLabel>
                          {dataTables?.data.map((table) => (
                            <SelectItem
                              key={table.id}
                              value={table.id as string}
                              disabled={table.status !== TABLE_STATUS.AVAILABLE}
                            >
                              <span>
                                {table.name} ({table.capacity} seats) -{" "}
                                <span className="capitalize">
                                  {table.status}
                                </span>
                              </span>
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
                disabled={createOrderIsPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createOrderIsPending}>
              {createOrderIsPending ? (
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
