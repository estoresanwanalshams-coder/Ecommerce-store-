import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GCC General Products Store | Home, Gadgets, Baby, Auto & Beauty",
    template: "%s | GCC General Products Store",
  },
  description:
    "Shop general products for GCC customers including home and kitchen, electronic gadgets, baby toys, automotive accessories, and health and beauty essentials across UAE and the Gulf.",
  keywords: [
    "GCC ecommerce",
    "UAE online shopping",
    "Dubai general products",
    "home and kitchen UAE",
    "electronic gadgets GCC",
    "baby toys UAE",
    "automotive accessories Gulf",
    "health beauty products UAE",
  ],
  openGraph: {
    title: "GCC General Products Store",
    description:
      "Responsive ecommerce store for home, gadgets, baby, automotive, health, and beauty products in the GCC.",
    type: "website",
    locale: "en_AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
