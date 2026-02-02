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
import { deleteTable } from "@/features/table/actions";
import { INITIAL_STATE_DELETE_TABLE_FORM } from "@/features/table/constants";
import { Table } from "@/features/table/types";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function DeleteTableDialog({
  open,
  onOpenChange,
  currentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: Table | null;
}) {
  // 🔹 Action State Delete
  const [deleteTableState, deleteTableAction, deleteTableIsPending] =
    useActionState(deleteTable, INITIAL_STATE_DELETE_TABLE_FORM);

  // 🔹 Handle Delete
  async function handleDelete() {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));

    startTransition(() => {
      deleteTableAction(formData);
    });
  }

  // 🔹 Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      startTransition(() => {
        deleteTableAction(null);
      });
    }
  }, [open, deleteTableAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (deleteTableState?.status === "error") {
      toast.error("Delete Table Failed", {
        description: deleteTableState.errors?._form?.[0],
      });
    }

    if (deleteTableState?.status === "success") {
      toast.success("Delete Table Success");
      onOpenChange(false);
    }
  }, [open, deleteTableState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Table</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this table?
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-start gap-4">
          <p className="font-medium">{currentData?.name}</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={deleteTableIsPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={deleteTableIsPending}
            variant="destructive"
          >
            {deleteTableIsPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
