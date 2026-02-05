import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Order Management",
    subtitle: "Take orders faster and reduce mistakes",
    description:
      "Create, update, and track customer orders in real time — from cashier to kitchen, all in one flow.",
  },
  {
    title: "Menu Management",
    subtitle: "Manage your menu with ease",
    description:
      "Add, edit, and organize menu items, prices, and categories without any hassle.",
  },
  {
    title: "Table Tracking",
    subtitle: "Know table status instantly",
    description:
      "Monitor table availability and ongoing orders in real time to keep service smooth.",
  },
  {
    title: "Role-Based Dashboard",
    subtitle: "Focused view for every role",
    description:
      "Separate dashboards for admin, cashier, and kitchen staff so everyone works efficiently.",
  },
];

export default function HomePage() {
  return (
    <div className="">
      {/* Start : Hero Section */}
      <div className="relative space-y-12 overflow-hidden">
        {/* Glow from bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full">
          <div className="absolute inset-0 bg-amber-500/50 bg-[radial-gradient(ellipse_35%_18%_at_bottom,theme(colors.pink.400)_0%,transparent_65%)] [mask-image:linear-gradient(to_top,transparent_0%,black_25%,black_55%,transparent_85%)] blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-12 px-56 py-24">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h4 className="rounded-md border px-4 py-1.5 text-center">
              Simple Point of Sale for Cafes
            </h4>
            <h1 className="text-center text-7xl/tight font-bold">
              Run Your Cafe Operations from One Simple Dashboard
            </h1>
            <p className="text-center">
              MyCafe POS helps cafe owners and staff manage menus, record
              orders, and track table status easily — all from a single,
              intuitive system.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button>Go to Dashboard</Button>
              </Link>
              <Button variant="outline">View Demo</Button>
            </div>
          </div>

          <div className="relative flex w-full justify-center p-8">
            <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-xl">
              <Image
                src="/assets/images/photos/dashboard-ss.png"
                alt="dashboard screenshot"
                fill
                className="[mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_90%)] object-contain object-top"
              />
            </div>
          </div>
        </div>
      </div>
      {/* End : Hero Section */}

      {/* Start : Features */}
      <div className="bg-amber-500/10 px-56 py-12">
        <div className="space-y-12">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-medium">
              Everything You Need to Run a Cafe
            </h2>
            <p>
              Four essential features designed to simplify daily cafe operations
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border-foreground flex flex-col items-center space-y-4 rounded-md border p-4"
              >
                <div className="space-y-2">
                  <p className="text-center text-xl font-medium">
                    {feature.title}
                  </p>
                  <p className="text-center text-sm">{feature.subtitle}</p>
                </div>

                <p className="text-muted-foreground text-center text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End : Features */}

      {/* Start : Footer */}
      <div className="flex items-center justify-center px-56 py-6">
        <p>© 2026 MyCafe POS. All rights reserved.</p>
      </div>
      {/* End : Footer */}
    </div>
  );
}
