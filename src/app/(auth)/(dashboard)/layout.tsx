import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import AppSidebar from "./_components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/shared/mode-toggle";
import DashboardBreadcrumb from "./_components/dashboard-breadcrumb";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="bg-muted!">
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden">
        {/* Start : Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
          <div>
            <ModeToggle />
          </div>
        </header>
        {/* End : Header */}

        {/* Start : Main */}
        <main className="flex flex-1 flex-col items-start gap-4 p-4">
          {children}
        </main>
        {/* Start : Main */}
      </SidebarInset>
    </SidebarProvider>
  );
}
