import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { generatePayment } from "@/features/order/actions";
import {
  INITIAL_STATE_GENERATE_PAYMENT,
  ORDER_MENU_STATUS,
  ORDER_STATUS,
} from "@/features/order/constants";
import { OrderMenuWithMenu, OrderWithTable } from "@/features/order/types";
import { usePricing } from "@/hooks/use-pricing";
import { formatRupiah } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function Summary({
  order,
  orderMenu,
  order_id,
}: {
  order?: OrderWithTable | null;
  orderMenu?: OrderMenuWithMenu[];
  order_id?: string;
}) {
  console.log(order);

  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  const isAllServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === ORDER_MENU_STATUS.SERVED);
  }, [orderMenu]);

  const [
    generatePaymentState,
    generatePaymentAction,
    generatePaymentIsPending,
  ] = useActionState(generatePayment, INITIAL_STATE_GENERATE_PAYMENT);

  const handleGeneratePayment = async () => {
    const formData = new FormData();

    formData.append("id", order_id || "");
    formData.append("gross_amount", grandTotal.toString());
    formData.append("customer_name", order?.customer_name || "");

    startTransition(() => {
      generatePaymentAction(formData);
    });
  };

  useEffect(() => {
    if (generatePaymentState?.status === "error") {
      toast.error("Generate Payment Failed", {
        description: generatePaymentState.errors?._form?.[0],
      });
    }

    if (generatePaymentState?.status === "success") {
      window.snap.pay(generatePaymentState.data.payment_token);
    }
  }, [generatePaymentState]);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>

        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order.customer_name?.toString()} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input value={order.tables?.name?.toString()} disabled />
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm">{formatRupiah(totalPrice)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{formatRupiah(tax)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Service (5%)</p>
            <p className="text-sm">{formatRupiah(service)}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-sm">{formatRupiah(grandTotal)}</p>
          </div>

          {order?.status === ORDER_STATUS.SERVED && (
            <Button
              type="submit"
              onClick={handleGeneratePayment}
              disabled={!isAllServed || generatePaymentIsPending}
              className="w-full cursor-pointer bg-amber-500 font-semibold text-white hover:bg-amber-600"
            >
              {generatePaymentIsPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Pay"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
