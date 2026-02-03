import { USER_ROLE } from "./constants";

// 🔹 User Role -> get from constant
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// 🔹 Profile
export type Profile = {
  id?: string;
  name?: string;
  role?: UserRole;
  avatar_url?: string;
};

// 🔹 Login Form
export type LoginFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

// 🔹 Create User Form
export type CreateUserFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
};

// 🔹 Update User Form
export type UpdateUserFormState = {
  status?: string;
  errors?: {
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
};

// 🔹 Delete User Form
export type DeleteUserFormState = {
  status?: string;
  errors?: {
    _form?: string[];
  };
};
