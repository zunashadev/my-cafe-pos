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
import { deleteMenu } from "@/features/menu/actions";
import { INITIAL_STATE_DELETE_MENU_FORM } from "@/features/menu/constants";
import { Menu } from "@/features/menu/types";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function DeleteMenuDialog({
  open,
  onOpenChange,
  currentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: Menu | null;
}) {
  // 🔹 Action State Delete
  const [deleteMenuState, deleteMenuAction, deleteMenuIsPending] =
    useActionState(deleteMenu, INITIAL_STATE_DELETE_MENU_FORM);

  // 🔹 Handle Delete
  async function handleDelete() {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));
    formData.append("avatar_url", String(currentData.image_url));

    startTransition(() => {
      deleteMenuAction(formData);
    });
  }

  // 🔹 Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      startTransition(() => {
        deleteMenuAction(null);
      });
    }
  }, [open, deleteMenuAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (deleteMenuState?.status === "error") {
      toast.error("Delete Menu Failed", {
        description: deleteMenuState.errors?._form?.[0],
      });
    }

    if (deleteMenuState?.status === "success") {
      toast.success("Delete Menu Success");
      onOpenChange(false);
    }
  }, [open, deleteMenuState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Menu</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this menu?
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-start gap-4">
          {currentData?.image_url && (
            <div className="flex-none">
              <Image
                src={currentData?.image_url as string}
                alt={currentData?.name ?? "menu image"}
                width={1020}
                height={1020}
                className="size-32 rounded object-cover"
                loading="eager"
              />
            </div>
          )}

          <p className="font-medium">{currentData?.name}</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={deleteMenuIsPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={deleteMenuIsPending}
            variant="destructive"
          >
            {deleteMenuIsPending ? (
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
