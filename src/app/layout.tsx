import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import '@fontsource-variable/outfit';
import '@fontsource-variable/noto-serif-georgian';
import { ToastProvider } from "@/components/ui/Toast";


export const metadata: Metadata = {
  title: "Room Intel",
  description: "Luxury Mountain Resort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
