import Script from "next/script";
import OrderDetail from "./_components/order-detail";
import { environment } from "@/config/environment";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <Script
        src={`${environment.MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Order Detail</h1>
        <OrderDetail order_id={id} />
      </div>
    </div>
  );
}
