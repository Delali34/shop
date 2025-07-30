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
  title: {
    default: "Opulence Ties - Premium Luxury Fashion & Accessories",
    template: "%s | Opulence Ties",
  },
  description:
    "Discover premium luxury fashion and accessories at Opulence Ties. Curated collection of high-end ties, fashion pieces, and exclusive accessories for the discerning individual.",
  keywords: [
    "luxury ties",
    "premium fashion",
    "designer accessories",
    "luxury menswear",
    "high-end fashion",
    "exclusive ties",
    "premium accessories",
    "luxury clothing",
    "designer fashion",
    "opulence ties",
  ],
  authors: [{ name: "Opulence Ties" }],
  creator: "Opulence Ties",
  publisher: "Opulence Ties",
  metadataBase: new URL("https://opulenceties.com"),
  alternates: {
    canonical: "https://opulenceties.com",
  },
  openGraph: {
    title: "Opulence Ties - Premium Luxury Fashion & Accessories",
    description:
      "Discover premium luxury fashion and accessories at Opulence Ties. Curated collection of high-end ties, fashion pieces, and exclusive accessories for the discerning individual.",
    url: "https://opulenceties.com",
    siteName: "Opulence Ties",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/9b551ec2-3fb7-430b-bef0-032f9ff651b3.png?token=HtYex2I2b3zks1nEjLqegR9UDAPmVPMhl71AaCxVAoo&height=900&width=1200&expires=33289906002",
        width: 1200,
        height: 900,
        alt: "Opulence Ties - Premium Luxury Fashion Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opulence Ties - Premium Luxury Fashion & Accessories",
    description:
      "Discover premium luxury fashion and accessories at Opulence Ties. Curated collection of high-end ties, fashion pieces, and exclusive accessories.",
    images: [
      "https://opengraph.b-cdn.net/production/images/9b551ec2-3fb7-430b-bef0-032f9ff651b3.png?token=HtYex2I2b3zks1nEjLqegR9UDAPmVPMhl71AaCxVAoo&height=900&width=1200&expires=33289906002",
    ],
    creator: "@opulenceties",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "fashion",
  classification: "business",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
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
        </Suspense>
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
