"use client";

import { useAuthStore } from "@/features/auth/stores";

export default function WelcomeCard() {
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="bg-muted w-full space-y-1 rounded-md p-6">
      <h1 className="text-2xl font-semibold">Hi, {profile?.name}!</h1>
      <p className="text-muted-foreground">
        {`Welcome back, let's check your store today.`}
      </p>
    </div>
  );
}
