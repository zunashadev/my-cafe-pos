import { NextResponse } from "next/server";
import { ORDER_STATUS } from "@/features/order/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const payload = await req.json();

  console.log("MIDTRANS PAYLOAD:", payload);

  const { midtrans_order_id, transaction_status, gross_amount } = payload;

  if (transaction_status === "settlement") {
    const supabase = await createAdminClient();

    await supabase
      .from("orders")
      .update({
        status: ORDER_STATUS.PAID,
        total_amount: Number(gross_amount),
        paid_at: new Date().toISOString(),
      })
      .eq("midtrans_order_id", midtrans_order_id);
  }

  return NextResponse.json({ received: true });
}
