import { ReactNode } from "react";

export default function UnauthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
