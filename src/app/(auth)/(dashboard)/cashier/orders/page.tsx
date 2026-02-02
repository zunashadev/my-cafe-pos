import OrdersManagement from "../../_components/orders/orders-management";

export default function OrdersPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Orders Management</h1>
        <OrdersManagement />
      </div>
    </div>
  );
}
