"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Hide the public-site Navbar/Footer on admin routes.
export default function LayoutChrome({ children }) {
  const pathname = usePathname() || "";
  const hideChrome = pathname.startsWith("/admin");

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
