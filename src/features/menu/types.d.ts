import { MENU_CATEGORY } from "./constants";

// 🔹 Menu
export type Menu = {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  price: number;
  discount?: number;
  image_url?: string;
  is_available?: boolean;
};

// 🔹 Menu Category -> get from constant
export type MenuCategory = (typeof MENU_CATEGORY)[keyof typeof MENU_CATEGORY];

// 🔹 Create Menu Form
export type CreateMenuFormState = {
  status?: string;
  errors?: {
    name?: string[];
    description?: string[];
    category?: string[];
    price?: string[];
    discount?: string[];
    image?: string[];
    is_available?: string[];
    _form?: string[];
  };
};

// 🔹 Update Menu Form
export type UpdateMenuFormState = {
  status?: string;
  errors?: {
    name?: string[];
    description?: string[];
    category?: string[];
    price?: string[];
    discount?: string[];
    image?: string[];
    is_available?: string[];
    _form?: string[];
  };
};

// 🔹 Delete Menu Form
export type DeleteMenuFormState = {
  status?: string;
  errors?: {
    _form?: string[];
  };
};
