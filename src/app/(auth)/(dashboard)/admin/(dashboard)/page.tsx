import { Separator } from "@/components/ui/separator";
import OrdersAnalitycsCard from "./_components/orders-chart";

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
        <div className="bg-muted w-full rounded-md border p-4">
          <p className="text-3xl">2130</p>
          <h4 className="text-muted-foreground">Total Orders</h4>
        </div>
        <div className="bg-muted w-full rounded-md border p-4">
          <p className="text-3xl">2130</p>
          <h4 className="text-muted-foreground">Total Orders</h4>
        </div>
        <div className="bg-muted w-full rounded-md border p-4">
          <p className="text-3xl">2130</p>
          <h4 className="text-muted-foreground">Total Orders</h4>
        </div>
        <div className="bg-muted w-full rounded-md border p-4">
          <p className="text-3xl">2130</p>
          <h4 className="text-muted-foreground">Total Orders</h4>
        </div>
      </div>
      {/* End : ... */}

      <Separator />

      {/* Start : Orders Analitycs */}
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="w-full space-y-4">
          <h3 className="text-2xl font-medium">Orders Analitycs</h3>
          <OrdersAnalitycsCard />
        </div>
        {/* .... */}
      </div>
      {/* End : Orders Analitycs */}
    </div>
  );
}
