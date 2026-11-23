import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";
import { Providers } from "@/components/ui/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LuxeShop — Premium Fashion & Lifestyle",
    template: "%s | LuxeShop",
  },
  description: "Premium fashion and lifestyle products curated for the modern individual.",
  keywords: ["fashion", "clothing", "accessories", "luxury", "online shopping"],
  openGraph: {
    type: "website",
    siteName: "LuxeShop",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
