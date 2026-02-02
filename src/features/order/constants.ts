import { INITIAL_STATE_ACTION } from "@/constants/general-constant";

// 🔹 ORDER STATUS
// Domain values -> used across DB, API, and UI
export const ORDER_STATUS = {
  DRAFT: "draft", // baru dibuat, belum dikonfirmasi -> masih bisa diedit
  CONFIRMED: "confirmed", // pesanan dikunci & dikirim ke dapur -> dapur mulai kerja
  SERVED: "served", // semua menu sudah disajikan
  PAID: "paid", // sudah dibayar -> trigger laporan & meja dilepas
  CANCELLED: "cancelled", // dibatalkan
} as const;

// 🔹 ORDER MENU STATUS
// Domain values -> used across DB, API, and UI
export const ORDER_MENU_STATUS = {
  PENDING: "pending", // masuk antrian dapur
  PREPARING: "preparing", // sedang dibuat
  READY: "ready", // siap disajikan
  SERVED: "served", // served
  CANCELLED: "cancelled", // dibatalkan
} as const;

// 🔹 CREATE ORDER FORM
export const INITIAL_CREATE_ORDER_FORM = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_STATE_CREATE_ORDER_FORM = {
  status: "idle",
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

// 🔹 MIDTRANS
export const INITIAL_STATE_GENERATE_PAYMENT = {
  ...INITIAL_STATE_ACTION,
  data: {
    payment_token: "",
  },
};
