import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Menu } from "@/features/menu/types";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";

export default function CardMenu({
  menu,
  onAddToCart,
}: {
  menu: Menu;
  onAddToCart: (item: Menu, type: "decrement" | "increment") => void;
}) {
  return (
    <Card className="h-fit w-full gap-0 overflow-hidden rounded-lg border p-0 shadow-sm">
      <Image
        src={menu.image_url as string}
        alt={menu.name as string}
        width={400}
        height={400}
        loading="eager"
        className="aspect-square w-full object-cover"
      />
      <CardContent className="px-4 py-2">
        <h3 className="text-lg font-semibold">{menu.name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {menu.description}
        </p>
      </CardContent>
      <CardFooter className="items-center justify-between p-4">
        <div className="text-xl font-bold">{formatRupiah(menu.price ?? 0)}</div>
        <Button
          className="cursor-pointer"
          onClick={() => onAddToCart(menu, "increment")}
        >
          <ShoppingCartIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
