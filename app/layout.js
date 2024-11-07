// app/layout.js
import "./globals.css";
import { Suspense } from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import CartProvider from "@/components/providers/CartProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Opulence tiers",
  description: "Opulence tiers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <ToastProvider />
            </CartProvider>
          </AuthProvider>
          <script
            src="https://js.paystack.co/v1/inline.js"
            strategy="beforeInteractive"
          />
        </Suspense>
      </body>
    </html>
  );
}
