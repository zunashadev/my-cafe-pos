import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "./types";

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;

  setAuth: (user: User, profile: Profile) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,

  setAuth: (user, profile) =>
    set({
      user,
      profile,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    }),
}));
