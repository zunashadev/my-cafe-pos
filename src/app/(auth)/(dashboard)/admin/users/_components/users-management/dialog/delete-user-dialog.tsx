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
import { deleteUser } from "@/features/auth/actions";
import { INITIAL_STATE_DELETE_USER_FORM } from "@/features/auth/constants";
import { Profile } from "@/features/auth/types";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function DeleteUserDialog({
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
  // 🔹 Action State Delete
  const [deleteUserState, deleteUserAction, deleteUserIsPending] =
    useActionState(deleteUser, INITIAL_STATE_DELETE_USER_FORM);

  // 🔹 Handle Delete
  async function handleDelete() {
    if (!currentData) return;

    const formData = new FormData();

    formData.append("id", String(currentData.id));
    formData.append("avatar_url", String(currentData.avatar_url));

    startTransition(() => {
      deleteUserAction(formData);
    });
  }

  // 🔹 Cleanup -> ketika modal ditutup
  useEffect(() => {
    if (!open) {
      startTransition(() => {
        deleteUserAction(null);
      });
    }
  }, [open, deleteUserAction]);

  // 🔹 Update Status Notification
  useEffect(() => {
    if (!open) return;

    if (deleteUserState?.status === "error") {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form?.[0],
      });
    }

    if (deleteUserState?.status === "success") {
      toast.success("Delete User Success");
      onOpenChange(false);
      refetch();
    }
  }, [open, deleteUserState, refetch, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this user?
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-start gap-4">
          <Avatar className="size-14 rounded-lg">
            {currentData?.avatar_url ? (
              <AvatarImage
                src={currentData?.avatar_url}
                alt="preview avatar"
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-muted-foreground rounded-lg text-2xl font-medium uppercase">
                {currentData?.name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="space-y-2">
            <p className="font-medium">{currentData?.name}</p>
            <span className="bg-muted rounded-md px-2 py-1 text-sm font-medium capitalize">
              {currentData?.role}
            </span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={deleteUserIsPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={deleteUserIsPending}
            variant="destructive"
          >
            {deleteUserIsPending ? (
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
