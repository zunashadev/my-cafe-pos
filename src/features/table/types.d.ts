import { TABLE_STATUS } from "./constants";

// 🔹 Table
export type Table = {
  id?: string;
  name?: string;
  description?: string;
  capacity?: number;
  status?: string;
};

// 🔹 Table Status -> get from constant
export type TableStatus = (typeof TABLE_STATUS)[keyof typeof TABLE_STATUS];

// 🔹 Create Table Form
export type CreateTableFormState = {
  status?: string;
  errors?: {
    name?: string[];
    description?: string[];
    capacity?: string[];
    status?: string[];
    _form?: string[];
  };
};

// 🔹 Update Table Form
export type UpdateTableFormState = {
  status?: string;
  errors?: {
    name?: string[];
    description?: string[];
    capacity?: string[];
    status?: string[];
    _form?: string[];
  };
};

// 🔹 Delete Table Form
export type DeleteTableFormState = {
  status?: string;
  errors?: {
    _form?: string[];
  };
};
