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
        <div className="section-padding-x relative z-10 space-y-12 py-24">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h4 className="rounded-md border px-4 py-1.5 text-center font-medium">
              🚀 Simple Point of Sale for Cafes
            </h4>
            <h1 className="text-center text-7xl/tight font-bold">
              Run Your Cafe Operations from{" "}
              <span className="text-amber-700 dark:text-amber-600">
                One Simple Dashboard
              </span>
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
            <div className="relative aspect-video w-full max-w-5xl rounded-2xl border-4 border-white/20 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_90%)] outline outline-offset-[-2px] outline-white/40">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/photos/dashboard-ss.png"
                  alt="dashboard screenshot"
                  fill
                  className="[mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_90%)] object-contain object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End : Hero Section */}

      {/* Start : Features */}
      <div className="section-padding-x bg-amber-500/10 py-12">
        <div className="space-y-12">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-bold">
              Everything You Need to Run a Cafe
            </h2>
            <p>
              Four essential features designed to simplify daily cafe operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border-foreground flex flex-col items-start space-y-4 rounded-md px-8 py-8"
              >
                <div className="space-y-2">
                  <p className="text-start text-2xl font-medium">
                    {feature.title}
                  </p>
                  <p className="text-start text-sm">{feature.subtitle}</p>
                </div>

                <p className="text-muted-foreground text-start text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End : Features */}

      {/* Start : Role */}
      {/* End : Role */}

      {/* Start : Footer */}
      <div className="section-padding-x flex items-center justify-center bg-amber-700 py-4 text-white">
        <p className="text-sm">© 2026 MyCafe POS. All rights reserved.</p>
      </div>
      {/* End : Footer */}
    </div>
  );
}
