import { ReactNode } from "react";
import Navbar from "./_components/navbar";

export default function LandingPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
