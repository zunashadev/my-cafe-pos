// 🔹 TABLE STATUS
// Domain values -> used across DB, API, and UI
export const TABLE_STATUS = {
  AVAILABLE: "available", // kosong, bisa dipakai
  RESERVED: "reserved", // dibooking
  OCCUPIED: "occupied", // sedang digunakan
  MAINTENANCE: "maintenance", // tidak bisa dipakai
} as const;

// 🔹 CREATE TABLE FORM
export const INITIAL_CREATE_TABLE_FORM = {
  name: "",
  description: "",
  capacity: "",
  status: "",
};

export const INITIAL_STATE_CREATE_TABLE_FORM = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    capacity: [],
    status: [],
    _form: [],
  },
};

// 🔹 UPDATE TABLE FORM
export const INITIAL_STATE_UPDATE_TABLE_FORM = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    capacity: [],
    status: [],
    _form: [],
  },
};

// 🔹 DELETE TABLE FORM
export const INITIAL_STATE_DELETE_TABLE_FORM = {
  status: "idle",
  errors: {
    _form: [],
  },
};
