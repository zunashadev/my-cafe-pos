"use client";

import { useAuthStore } from "@/features/auth/stores";
import { Profile } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export function AuthHydrator({ profile }: { profile: Profile | null }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user || !profile) {
        clearAuth();
        return;
      }

      setAuth(data.user, profile);
    });
  }, [profile, setAuth, clearAuth]);

  return null;
}
