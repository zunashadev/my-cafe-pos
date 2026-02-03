import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS } from "@/features/order/constants";

export async function POST(req: Request) {
  const rawBody = await req.text();

  console.log("MIDTRANS RAW BODY:", rawBody);

  const payload = await req.json();

  console.log("MIDTRANS PAYLOAD:", payload);

  const { order_id, transaction_status, gross_amount } = payload;

  // (nanti WAJIB tambah verifikasi signature)

  if (transaction_status === "settlement") {
    const supabase = await createClient();

    await supabase
      .from("orders")
      .update({
        status: ORDER_STATUS.PAID,
        total_amount: Number(gross_amount),
        paid_at: new Date().toISOString(),
      })
      .eq("order_id", order_id)
      .eq("status", ORDER_STATUS.SERVED); // safety
  }

  return NextResponse.json({ received: true });
}
