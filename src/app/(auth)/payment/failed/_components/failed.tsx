"use client";

import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Ban className="size-32 text-red-500" />
        <h1 className="text-4xl font-semibold">Payment Failed</h1>
        <Link href="/admin/orders">
          <Button>Back to Order</Button>
        </Link>
      </div>
    </div>
  );
}
