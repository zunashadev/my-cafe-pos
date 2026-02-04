import { Menu } from "../menu/types";
import { Table } from "../table/types";
import { ORDER_MENU_STATUS, ORDER_STATUS } from "./constants";

// 🔹 Order
export type Order = {
  id?: string;
  order_id?: string;
  customer_name?: string | null;
  table_id?: string | null;
  payment_token?: string | null;
  status: OrderStatus;
};

// 🔹 Order With Table
export type OrderWithTable = Order & {
  tables: Table;
};

// 🔹 Order Menus Summary
export type OrderMenusSummary = {
  order_id: string;
  total_items: number;
  pending: number;
  preparing: number;
  ready: number;
  served: number;
  cancelled: number;
};

// 🔹 Order With Table & Menus Summary
export type OrderWithTableAndSummary = Order & {
  tables: Table;
  summary?: OrderMenusSummary;
};

// 🔹 Order Status -> get from constant
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// 🔹 Order Menu Status -> get from constant
export type OrderMenuStatus =
  (typeof ORDER_MENU_STATUS)[keyof typeof ORDER_MENU_STATUS];

// 🔹 Order Menu
export type OrderMenu = {
  id?: string;
  order_id?: string;
  menu_id?: string;
  quantity?: number;
  notes?: string | null;
  status?: string;
};

// 🔹 Order Menu With Menu
export type OrderMenuWithMenu = OrderMenu & {
  menus: Menu;
};

// 🔹 Create Order Form
export type CreateOrderFormState = {
  status?: string;
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

// 🔹 Cart
export type CartItem = {
  order_id?: string;
  menu_id?: string;
  quantity: number;
  notes: string;
  menu: Menu;
  total: number;
};

// 🔹 Order Analytics Row
export type OrderAnalyticsRow = {
  id: number;
  created_at: string;
  status: OrderStatus;
};

// 🔹 Today Summary
type TodaySummary = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  progress: number; // completed / total * 100

  statusBreakdown: {
    draft: number;
    confirmed: number;
    served: number;
    paid: number;
    cancelled: number;
  };

  activeOrderList: OrderWithTable[];
};
