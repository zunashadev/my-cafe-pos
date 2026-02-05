"use client";

import CoffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores";
import Link from "next/link";

export default function Navbar() {
  // 🔹 Stores
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="bg-background sticky top-0 z-50 px-56 py-2">
      {/* Gradient bottom border */}
      <div className="via-foreground/40 pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent to-transparent" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 py-4">
          <CoffeeCupIcon className="size-8 text-amber-500" />
          <h1 className="text-lg font-medium text-amber-500">MyCafe POS</h1>
        </div>

        <div className="flex items-center gap-3">
          {profile ? (
            <Link href="/login">
              <div className="flex items-center gap-2">
                <div className="text-end">
                  <h4 className="font-medium">{profile?.name} </h4>
                  <p className="text-muted-foreground text-xs capitalize">
                    {profile?.role}
                  </p>
                </div>
                <Avatar>
                  <AvatarImage
                    src={profile?.avatar_url}
                    alt={profile?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="uppercase">
                    {profile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}

          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
