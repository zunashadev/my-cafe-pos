import { Separator } from "@/components/ui/separator";
import OrdersAnalitycsCard from "./_components/orders-chart";
import { BarChart3, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="w-full space-y-6">
      {/* Start : ... */}
      <div className="bg-muted w-full space-y-2 rounded-md p-6">
        <h1 className="text-4xl font-semibold">Hi, ...!</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      {/* End : ... */}

      <Separator />

      {/* Start : ... */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-muted w-full space-y-6 rounded-md border p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-500 bg-amber-500/20 p-2">
              <DollarSign className="text-amber-600" />
            </div>
            <p className="text-xl">Total Revenue</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-medium">Rp 1.000.000</p>
            <p className="text-muted-foreground text-sm">Revenue this month</p>
          </div>
        </div>
        {/* Average Revenue */}
        <div className="bg-muted w-full space-y-6 rounded-md border p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-500 bg-amber-500/20 p-2">
              <BarChart3 className="text-amber-600" />
            </div>
            <p className="text-xl">Average Revenue</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-medium">Rp 160.000</p>
            <p className="text-muted-foreground text-sm">Average per day</p>
          </div>
        </div>
        {/* Total Orders */}
        <div className="bg-muted w-full space-y-6 rounded-md border p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-500 bg-amber-500/20 p-2">
              <ShoppingCart className="text-amber-600" />
            </div>
            <p className="text-xl">Total Orders</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-medium">20</p>
            <p className="text-muted-foreground text-sm">
              Order settled this month
            </p>
          </div>
        </div>
        {/* Growth Rate */}
        <div className="bg-muted w-full space-y-6 rounded-md border p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-500 bg-amber-500/20 p-2">
              <TrendingUp className="text-amber-600" />
            </div>
            <p className="text-xl">Growth Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-medium">2300.29%</p>
            <p className="text-muted-foreground text-sm">
              Compared to last month
            </p>
          </div>
        </div>
      </div>
      {/* End : ... */}

      <Separator />

      {/* Start : Orders Analitycs */}
      <div className="grid w-full grid-cols-2 gap-4">
        {/* Orders Analitycs */}
        <div className="bg-muted w-full space-y-4 rounded-md border p-6">
          <h3 className="text-2xl font-medium">Orders Analitycs</h3>
          <OrdersAnalitycsCard />
        </div>

        {/* Active Orders */}
        <div className="bg-muted w-full rounded-md border p-6">
          <h4 className="text-2xl font-medium">Active Orders</h4>
        </div>
      </div>
      {/* End : Orders Analitycs */}
    </div>
  );
}
