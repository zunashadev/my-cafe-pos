import {
  Album,
  Armchair,
  LayoutDashboard,
  SquareMenu,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: Album,
    },
    {
      title: "Menus",
      url: "/admin/menus",
      icon: SquareMenu,
    },
    {
      title: "Tables",
      url: "/admin/tables",
      icon: Armchair,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
  ],
  cashier: [
    {
      title: "Dashboard",
      url: "/cashier",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/cashier/orders",
      icon: Album,
    },
  ],
  kitchen: [
    {
      title: "Dashboard",
      url: "/kitchen",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/kitchen/orders",
      icon: Album,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
