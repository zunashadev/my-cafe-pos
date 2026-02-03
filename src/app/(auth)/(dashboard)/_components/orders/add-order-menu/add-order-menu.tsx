"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMenus } from "@/features/menu/hooks";
import { useOrder } from "@/features/order/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import CardMenu from "./card-menu";
import CardMenuSkeleton from "./card-menu-skeleton";
import CartSection from "./cart";
import { CartItem } from "@/features/order/types";
import { Menu } from "@/features/menu/types";
import { addOrderMenu } from "@/features/order/actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { ORDER_MENU_STATUS } from "@/features/order/constants";
import { MENU_CATEGORY, MENU_CATEGORY_ICON } from "@/features/menu/constants";

export default function AddOrderMenu({ id }: { id: string }) {
  // 🔹 MENUS
  // 🔹 UI States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // 🔹 Fetch Data Menus from DB
  const {
    data: menusData,
    isLoading: menusIsLoading,
    isError: menusIsError,
    error: menusError,
    refetch: menusRefetch,
  } = useMenus({
    search: useDebounce(search, 500),
    category,
    isAvailable: true,
  });

  // 🔹 Toast Error
  useEffect(() => {
    if (menusIsError && menusError) {
      toast.error("Get Menus Data Failed", {
        description: menusError.message,
      });
    }
  }, [menusIsError, menusError]);

  // 🔹 ORDER DETAIL
  // 🔹 Fetch Order Detail from DB
  const {
    data: orderData,
    isLoading: orderIsLoading,
    isError: orderIsError,
    error: orderError,
    refetch: orderRefetch,
  } = useOrder(id);

  // 🔹 Toast Error for Fetch Order Detail
  useEffect(() => {
    if (orderIsError && orderError) {
      toast.error("Get Order Detail Failed", {
        description: orderError.message,
      });
    }
  }, [orderIsError, orderError]);

  // 🔹 ADD TO CART
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (menu: Menu, action: "increment" | "decrement") => {
    const existingItem = cart.find((item) => item.menu_id === menu.id);

    if (existingItem) {
      if (action === "decrement") {
        if (existingItem.quantity > 1) {
          setCart(
            cart.map((item) =>
              item.menu_id === menu.id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    total: item.total - menu.price,
                  }
                : item,
            ),
          );
        } else {
          setCart(cart.filter((item) => item.menu_id !== menu.id));
        }
      } else {
        setCart(
          cart.map((item) =>
            item.menu_id === menu.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total: item.total + menu.price!,
                }
              : item,
          ),
        );
      }
    } else {
      setCart([
        ...cart,
        { menu_id: menu.id, quantity: 1, total: menu.price, notes: "", menu },
      ]);
    }
  };

  // 🔹 ADD ORDER ITEM
  // 🔹 Use Action State
  const [addOrderMenuState, addOrderMenuAction, addOrderMenuIsPending] =
    useActionState(addOrderMenu, INITIAL_STATE_ACTION);

  const handleOrder = async () => {
    const formData = new FormData();

    const orderMenusPayload = cart.map((item) => ({
      order_id: id,
      menu_id: item.menu_id,
      quantity: item.quantity,
      notes: item.notes,
      status: ORDER_MENU_STATUS.PENDING,
    }));

    formData.append("order_id", id);
    formData.append("order_menus", JSON.stringify(orderMenusPayload));

    startTransition(() => {
      addOrderMenuAction(formData);
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <div className="space-y-8 lg:w-2/3">
        {/* Start : Filter & Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">Select Category</p>
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Filter Category */}
            <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex w-full items-center gap-2 overflow-x-auto py-2">
              {Object.values(MENU_CATEGORY).map((c) => {
                const Icon = MENU_CATEGORY_ICON[c];

                return (
                  <Button
                    key={c}
                    variant={category === c ? "default" : "outline"}
                    onClick={() => {
                      setCategory(category === c ? null : c);
                    }}
                    className="w-40 gap-3 py-8 text-base capitalize [&_svg]:!h-8 [&_svg]:!w-8"
                  >
                    {Icon && <Icon className="text-muted-foreground" />}
                    {c}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* End : Filter & Search */}

        {/* Start : Menus */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">Select Menu</p>

            <div>
              <InputGroup>
                <InputGroupInput
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search order menu..."
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3">
            {/* Loading */}
            {menusIsLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <CardMenuSkeleton key={`skeleton-menu-${index}`} />
              ))}

            {/* Data */}
            {!menusIsLoading &&
              menusData?.data &&
              menusData.data.length > 0 &&
              menusData.data.map((menu) => (
                <CardMenu
                  key={`menu-${menu.id}`}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                />
              ))}

            {/* Empty */}
            {!menusIsLoading && menusData?.data?.length === 0 && (
              <div className="text-muted-foreground col-span-full text-center">
                Menu tidak ditemukan 🍽️
              </div>
            )}
          </div>
        </div>
        {/* End : Menus */}
      </div>

      {/* Start : Order Info */}
      <div className="lg:w-1/3">
        <CartSection
          order={orderData}
          cart={cart}
          setCart={setCart}
          onAddToCart={handleAddToCart}
          isLoading={addOrderMenuIsPending}
          onOrder={handleOrder}
        />
      </div>
      {/* End : Order Info */}
    </div>
  );
}
