import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Menu } from "@/features/menu/types";
import { CartItem, OrderWithTable } from "@/features/order/types";
import { useDebounce } from "@/hooks/use-debounce";
import { formatRupiah } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function CartSection({
  order,
  cart,
  setCart,
  onAddToCart,
  isLoading,
  onOrder,
}: {
  order?: OrderWithTable | null;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  onAddToCart: (item: Menu, type: "decrement" | "increment") => void;
  isLoading: boolean;
  onOrder: () => void;
}) {
  const handleAddNote = (id: string, notes: string) => {
    setCart(
      cart.map((item) => (item.menu_id === id ? { ...item, notes } : item)),
    );
  };
  return (
    <Card>
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
          <h3 className="text-lg font-semibold">Cart</h3>

          {cart.length > 0 ? (
            cart.map((item: CartItem) => (
              <div key={item.menu.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.menu.image_url as string}
                      alt={item.menu.name as string}
                      width={30}
                      height={30}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm">{item.menu.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatRupiah(item.total / item.quantity)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{formatRupiah(item.total)}</p>
                </div>

                <div className="flex w-full items-center gap-4">
                  <Input
                    placeholder="Add note..."
                    className="w-full"
                    onChange={(e) => {
                      handleAddNote(item.menu.id!, e.target.value);
                    }}
                  />

                  <div className="flex items-center gap-4">
                    <Button
                      className="cursor-pointer font-semibold"
                      variant="outline"
                      onClick={() => onAddToCart(item.menu!, "decrement")}
                    >
                      -
                    </Button>
                    <p className="font-semibold">{item.quantity}</p>
                    <Button
                      className="cursor-pointer font-semibold"
                      variant="outline"
                      onClick={() => onAddToCart(item.menu!, "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm">No item in cart</p>
          )}
          <Button
            onClick={onOrder}
            className="w-full cursor-pointer bg-amber-500 font-semibold text-white hover:bg-amber-600"
          >
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
