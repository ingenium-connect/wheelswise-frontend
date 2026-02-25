import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/layout/Header";
import ClearClientState from "@/components/auth/ClearClientState";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wheelswise",
  description: "Your trusted partner for vehicle insurance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#397397" />
        <main className="flex flex-col min-h-screen">
          <Header />
          <ClearClientState />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
