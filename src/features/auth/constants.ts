// 🔹 USER ROLE
export const USER_ROLE = {
  ADMIN: "admin",
  CASHIER: "cashier",
  KITCHEN: "kitchen",
} as const;

// 🔹 ROLE OPTIONS
export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Cashier", value: "cashier" },
  { label: "Kitchen", value: "kitchen" },
];

// 🔹 LOGIN FORM
export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

// 🔹 CREATE USER FORM
export const INITIAL_CREATE_USER_FORM = {
  name: "",
  role: "",
  avatar: null as File | null,
  email: "",
  password: "",
};

export const INITIAL_STATE_CREATE_USER_FORM = {
  status: "idle",
  errors: {
    name: [],
    role: [],
    avatar: [],
    email: [],
    password: [],
    _form: [],
  },
};

// 🔹 UPDATE USER FORM
export const INITIAL_STATE_UPDATE_USER_FORM = {
  status: "idle",
  errors: {
    name: [],
    role: [],
    avatar: [],
    _form: [],
  },
};

// 🔹 DELETE USER FORM
export const INITIAL_STATE_DELETE_USER_FORM = {
  status: "idle",
  errors: {
    _form: [],
  },
};
