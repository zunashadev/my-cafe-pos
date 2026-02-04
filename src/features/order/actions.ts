"use server";

import z from "zod";
import { CreateTableFormState, TableStatus } from "../table/types";
import {
  INITIAL_STATE_CREATE_ORDER_FORM,
  INITIAL_STATE_GENERATE_PAYMENT,
  ORDER_MENU_STATUS,
  ORDER_STATUS,
} from "./constants";
import { createOrderSchema } from "./schemas";
import { createClient } from "@/lib/supabase/server";
import { TABLE_STATUS } from "../table/constants";
import { FormState } from "@/types/general";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { OrderMenuStatus, OrderStatus } from "./types";
import { redirect } from "next/navigation";
import midtrans from "midtrans-client";
import { environment } from "@/config/environment";
import { cookies } from "next/headers";
import { USER_ROLE } from "../auth/constants";

// 🔹 Create Order
export async function createOrder(
  prevState: CreateTableFormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_CREATE_ORDER_FORM;

  // 🔹 Server Validation Fields
  const validatedFields = createOrderSchema.safeParse({
    customer_name: formData.get("customer_name"),
    table_id: formData.get("table_id"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      status: "error",
      errors: {
        customer_name: fieldErrors.customer_name ?? [],
        table_id: fieldErrors.table_id ?? [],
        _form: [],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Insert Table
  const orderId = `MYCAFE-${Date.now()}`;

  const [orderResult, tableResult] = await Promise.all([
    supabase.from("orders").insert({
      order_id: orderId,
      customer_name: validatedFields.data.customer_name,
      table_id: validatedFields.data.table_id,
      status: ORDER_STATUS.DRAFT,
    }),
    supabase
      .from("tables")
      .update({
        status: TABLE_STATUS.RESERVED,
      })
      .eq("id", validatedFields.data.table_id),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError ? [orderError.message] : []),
          ...(tableError ? [tableError.message] : []),
        ],
      },
    };
  }

  return {
    status: "success",
  };
}

// 🔹 Update Order Status
export async function updateOrderStatus(
  prevState: FormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_ACTION;

  // 🔹 Get Data
  const id = formData.get("id");
  const tableId = formData.get("table_id");
  const status = formData.get("status") as OrderStatus | null;

  if (!id || !tableId || !status) {
    return {
      status: "error",
      errors: {
        _form: ["Invalid form data"],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Mapping order → table status
  const TABLE_STATUS_BY_ORDER: Record<OrderStatus, TableStatus> = {
    draft: TABLE_STATUS.AVAILABLE,
    confirmed: TABLE_STATUS.OCCUPIED,
    served: TABLE_STATUS.OCCUPIED,
    paid: TABLE_STATUS.AVAILABLE,
    cancelled: TABLE_STATUS.AVAILABLE,
  };

  const tableStatus = TABLE_STATUS_BY_ORDER[status];

  // 🔹 Update Order & Table
  const [orderResult, tableResult] = await Promise.all([
    supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", formData.get("id")),
    supabase
      .from("tables")
      .update({
        status: tableStatus,
      })
      .eq("id", formData.get("table_id")),
  ]);

  if (orderResult.error || tableResult.error) {
    return {
      status: "error",
      errors: {
        _form: [
          ...(orderResult.error ? [orderResult.error.message] : []),
          ...(tableResult.error ? [tableResult.error.message] : []),
        ],
      },
    };
  }

  return {
    status: "success",
  };
}

// 🔹 Add Order Menu
export async function addOrderMenu(prevState: FormState, formData: FormData) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_ACTION;

  const order_id = formData.get("order_id");

  const raw = formData.get("order_menus");

  if (!raw || typeof raw !== "string") {
    throw new Error("Invalid order menus payload");
  }

  const orderMenus = JSON.parse(raw) as {
    order_id: string;
    menu_id: string;
    quantity: number;
    notes: string;
  }[];

  const supabase = await createClient();

  const { error } = await supabase.from("orders_menus").insert(orderMenus);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState,
        _form: [error.message],
      },
    };
  }

  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("user_profile");
  const profile = profileCookie ? JSON.parse(profileCookie.value) : null;

  let redirectPath = `/orders/${order_id}`;

  if (profile.role === USER_ROLE.ADMIN) {
    redirectPath = `/admin/orders/${order_id}`;
  } else if (profile.role === USER_ROLE.CASHIER) {
    redirectPath = `/cashier/orders/${order_id}`;
  }

  redirect(redirectPath);
}

// 🔹 Update Order Menu Status
export async function updateOrderMenuStatus(
  prevState: FormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_ACTION;

  // 🔹 Get Data
  const id = formData.get("id");
  const status = formData.get("status") as OrderMenuStatus | null;

  if (!id || !status) {
    return {
      status: "error",
      errors: {
        _form: ["Invalid form data"],
      },
    };
  }

  // 🔹 Basic Status Validation
  if (!Object.values(ORDER_MENU_STATUS).includes(status)) {
    return {
      status: "error",
      errors: {
        _form: ["Invalid order menu status"],
      },
    };
  }

  // 🔹 Create Supabase Server Client
  const supabase = await createClient();

  // 🔹 Update Order Menu Status
  const { data: updatedMenu, error: updateError } = await supabase
    .from("orders_menus")
    .update({
      status,
    })
    .eq("id", id)
    .select("order_id")
    .single();

  if (updateError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [updateError.message],
      },
    };
  }

  // 🔹 Hanya lanjut jika status = served
  if (status !== ORDER_MENU_STATUS.SERVED) {
    return { status: "success" };
  }

  // 🔹 Ambil Semua Menu di Order tersebut
  const { data: menus, error: menusError } = await supabase
    .from("orders_menus")
    .select("status")
    .eq("order_id", updatedMenu.order_id);

  if (menusError || !menus) {
    return {
      status: "error",
      errors: {
        _form: [menusError?.message ?? "Failed to fetch menus"],
      },
    };
  }

  // 🔹 Cek Apakah Semua 'Served'
  const allServed = menus.every(
    (menu) => menu.status === ORDER_MENU_STATUS.SERVED,
  );

  if (!allServed) {
    return { status: "success" }; // tetap return success karena update status menu berhasil
  }

  // 🔹 Update order status → served
  await supabase
    .from("orders")
    .update({ status: ORDER_STATUS.SERVED })
    .eq("order_id", updatedMenu.order_id);

  return { status: "success" };
}

// 🔹 Generate Payment
export async function generatePayment(
  prevState: FormState,
  formData: FormData | null,
) {
  // 🔹 Reset State
  if (!formData) return INITIAL_STATE_GENERATE_PAYMENT;

  const orderId = formData.get("id");
  const grossAmount = formData.get("gross_amount");
  const customerName = formData.get("customer_name");

  const supabase = await createClient();

  const midtransOrderId = `${orderId}-${Date.now()}`;

  const snap = new midtrans.Snap({
    isProduction: false,
    serverKey: environment.MIDTRANS_SERVER_KEY,
  });

  const parameter = {
    transaction_details: {
      order_id: midtransOrderId,
      gross_amount: parseFloat(grossAmount as string),
    },
    customer_details: {
      first_name: customerName,
    },
  };

  const result = await snap.createTransaction(parameter);

  if (!result.token) {
    return {
      status: "error",
      errors: { _form: ["Failed to create transaction"] },
      data: { payment_token: "" },
    };
  }

  await supabase
    .from("orders")
    .update({
      payment_token: result.token,
      midtrans_order_id: midtransOrderId,
    })
    .eq("order_id", orderId);

  return {
    status: "success",
    data: {
      payment_token: `${result.token}`,
    },
  };
}

// 🔹 Get Dashboard KPI
function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    daysInMonth: end.getDate(),
  };
}

export async function getDashboardKPI() {
  const supabase = await createClient();

  // 📅 Bulan ini
  const current = getMonthRange(new Date());

  // 📅 Bulan lalu
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const previous = getMonthRange(lastMonthDate);

  // =====================
  // 1. DATA BULAN INI
  // =====================
  const { data: currentOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", ORDER_STATUS.PAID)
    .gte("paid_at", current.start)
    .lte("paid_at", current.end);

  const totalRevenue =
    currentOrders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0;

  const totalOrder = currentOrders?.length ?? 0;

  const averageRevenue =
    current.daysInMonth > 0 ? totalRevenue / current.daysInMonth : 0;

  // =====================
  // 2. DATA BULAN LALU
  // =====================
  const { data: previousOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", ORDER_STATUS.PAID)
    .gte("paid_at", previous.start)
    .lte("paid_at", previous.end);

  const previousRevenue =
    previousOrders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0;

  // =====================
  // 3. GROWTH RATE
  // =====================
  const growthRate =
    previousRevenue === 0
      ? 0
      : ((totalRevenue - previousRevenue) / previousRevenue) * 100;

  return {
    totalRevenue,
    averageRevenue,
    totalOrder,
    growthRate,
  };
}
