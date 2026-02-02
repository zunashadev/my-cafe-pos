export const MENU_CATEGORY = {
  COFFEE: "coffee",
  NON_COFFEE: "non-coffee",
  PASTRY: "pastry",
  DESSERT: "dessert",
  FOOD: "food",
  SNACK: "snack",
  BEVERAGE: "beverage",
} as const;

// 🔹 CREATE MENU FORM
export const INITIAL_CREATE_MENU_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  discount: "",
  image: null as File | null,
  is_available: "",
};

export const INITIAL_STATE_CREATE_MENU_FORM = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    category: [],
    price: [],
    discount: [],
    image: [],
    is_available: [],
    _form: [],
  },
};

// 🔹 UPDATE MENU FORM
export const INITIAL_STATE_UPDATE_MENU_FORM = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    category: [],
    price: [],
    discount: [],
    image: [],
    is_available: [],
    _form: [],
  },
};

// 🔹 DELETE MENU FORM
export const INITIAL_STATE_DELETE_MENU_FORM = {
  status: "idle",
  errors: {
    _form: [],
  },
};
