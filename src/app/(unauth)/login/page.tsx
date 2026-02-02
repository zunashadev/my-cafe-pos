import { ModeToggle } from "@/components/shared/mode-toggle";
import LoginForm from "./_components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-screen p-0">
      <div className="flex h-full overflow-hidden">
        <div className="bg-muted-foreground relative w-1/3 p-4 lg:w-1/2">
          <Image
            src="/assets/images/photos/cafe-interior.png"
            alt="cafe-interior"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative flex w-2/3 items-center justify-center p-4 lg:w-1/2">
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
