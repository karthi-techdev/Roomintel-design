import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/Toast";
import { AlertContainer } from "@/components/ui/AlertContainer";
import RouteLoader from "@/components/RouteLoader";
import '@fontsource-variable/outfit';

export const metadata: Metadata = {
  title: "AvensStay | Book your perfect stay",
  description: "Luxury Mountain Resort",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <RouteLoader />
          <AlertContainer />
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>

        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}

