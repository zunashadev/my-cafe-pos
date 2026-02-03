"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/features/order/constants";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess() {
  // const searchParams = useSearchParams();
  // const orderId = searchParams.get("order_id");

  // const supabase = createClient();

  // const { mutate } = useMutation({
  //   mutationKey: ["mutateUpdateStatusOrder"],
  //   mutationFn: async () => {
  //     await supabase
  //       .from("orders")
  //       .update({ status: ORDER_STATUS.PAID })
  //       .eq("order_id", orderId);
  //   },
  // });

  // useEffect(() => {
  //   mutate();
  // }, [mutate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="size-32 text-green-500" />
        <h1 className="text-4xl font-semibold">Payment Success</h1>
        <Link href="/admin/orders">
          <Button>Back to Order</Button>
        </Link>
      </div>
    </div>
  );
}
