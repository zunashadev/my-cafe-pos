"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { logout } from "@/features/auth/actions";
import { useAuthStore } from "@/features/auth/stores";
import { cn } from "@/lib/utils";
import { EllipsisVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      {/* Start : Sidebar Header */}
      <SidebarHeader></SidebarHeader>
      {/* End : Sidebar Header */}

      {/* Start : Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Group 1</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[profile?.role as SidebarMenuKey]?.map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.url}
                        className={cn(`h-auto px-4 py-3`, {
                          "bg-amber-500 text-white hover:bg-amber-500 hover:text-white":
                            pathname === item.url,
                        })}
                      >
                        {" "}
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* End : Sidebar Content */}

      {/* Start : Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {/* Dropdown Trigger */}
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar>
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="uppercase">
                      {profile?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{profile?.name} </h4>
                    <p className="text-muted-foreground text-xs capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/* Dropdown Content */}
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                sideOffset={4}
                className="min-w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Menu 1</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Menu 2</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Menu 3</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => logout()}
                    >
                      <LogOut />
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* End : Sidebar Footer */}
    </Sidebar>
  );
}
