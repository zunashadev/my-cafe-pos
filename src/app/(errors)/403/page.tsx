"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-muted-foreground">
        {"You don't have access to this page."}
      </p>

      <Button
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
      >
        Back
      </Button>
    </div>
  );
}
