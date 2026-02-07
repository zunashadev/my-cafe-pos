import { Separator } from "@/components/ui/separator";
import OrdersAnalitycsCard from "./_components/orders-chart";
import { BarChart3, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { getDashboardKPI } from "@/features/order/actions";
import { formatRupiah } from "@/lib/utils";
import { KPICard } from "./_components/kpi/kpi-card";
import TodaySummary from "./_components/today-summary/today-summary";
import WelcomeCard from "./_components/welcome-card";

export default async function CashierPage() {
  // 🔹 Dashboard KPI
  const kpi = await getDashboardKPI();

  return (
    <div className="w-full space-y-6">
      {/* Start : ... */}
      <WelcomeCard />
      {/* End : ... */}

      <Separator />

      {/* Start : ... */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <KPICard
          title="Total Revenue"
          value={formatRupiah(kpi.totalRevenue)}
          subtitle="Revenue this month"
          icon={<DollarSign className="size-5" />}
        />
        {/* Average Revenue */}
        <KPICard
          title="Average Revenue"
          value={formatRupiah(kpi.averageRevenue)}
          subtitle="Average per day"
          icon={<BarChart3 className="size-5" />}
        />
        {/* Total Orders */}
        <KPICard
          title="Total Orders"
          value={kpi.totalOrder}
          subtitle="Order settled this month"
          icon={<ShoppingCart className="size-5" />}
        />
        {/* Growth Rate */}
        <KPICard
          title="Growth Rate"
          value={`${kpi.growthRate.toFixed(1)}%`}
          subtitle="Compared to last month"
          icon={<TrendingUp className="size-5" />}
          trend={kpi.growthRate}
        />
      </div>
      {/* End : ... */}

      <Separator />

      {/* Start : Orders Analitycs */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Orders Analitycs */}
        <div className="w-full space-y-4 rounded-md border p-6">
          <OrdersAnalitycsCard />
        </div>

        {/* Active Orders */}
        <TodaySummary />
      </div>
      {/* End : Orders Analitycs */}
    </div>
  );
}
