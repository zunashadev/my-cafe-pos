import { ReactNode } from "react";

export default function UnauthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <main>{children}</main>
    </div>
  );
}
