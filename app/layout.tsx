import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/layout/Header";
import ClearClientState from "@/components/auth/ClearClientState";
import GlobalJsonLd from "@/components/seo/GlobalJsonLd";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com",
  ),
  title: {
    template: "%s | Wheelswise",
    default: "Wheelswise — Buy Motor Insurance Online in Kenya",
  },
  description:
    "Compare and buy comprehensive motor insurance and third party (TPO) cover online in Kenya. Instant quotes from IRA-licensed underwriters. Private, commercial & PSV vehicles. Pay via M-Pesa.",
  keywords: [
    "motor insurance Kenya",
    "car insurance Kenya",
    "buy motor insurance online Kenya",
    "comprehensive motor insurance",
    "third party insurance Kenya",
    "TPO insurance Kenya",
    "vehicle insurance Kenya",
    "motor vehicle insurance",
    "insurance quote Kenya",
    "private car insurance",
    "commercial vehicle insurance Kenya",
    "PSV insurance Kenya",
    "insurance underwriter Kenya",
    "IRA licensed insurance",
    "digital insurance Kenya",
    "motor insurance premium Kenya",
    "cheap car insurance Kenya",
    "online insurance policy Kenya",
    "M-Pesa insurance payment",
    "MedGen Insurance",
    "Wheelswise insurance",
    "insurance intermediary Kenya",
    "cover type insurance",
    "comprehensive vs third party",
    "motor insurance certificate Kenya",
  ],
  authors: [{ name: "MedGen Insurance Agency" }],
  creator: "MedGen Insurance Agency",
  publisher: "MedGen Insurance Agency",
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Wheelswise",
    title: "Wheelswise — Buy Motor Insurance Online in Kenya",
    description:
      "Compare and buy comprehensive motor insurance and third party (TPO) cover in Kenya. Instant quotes from IRA-licensed underwriters. Pay via M-Pesa.",
    images: [
      {
        url: "/logo.png",
        alt: "Wheelswise — Kenya's Digital Motor Insurance Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelswise — Buy Motor Insurance Online in Kenya",
    description:
      "Compare motor insurance plans from top Kenyan underwriters. Instant quotes, M-Pesa payment, instant certificate.",
    images: ["/logo.png"],
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
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "finance",
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
        <GlobalJsonLd />
        <NextTopLoader color="#397397" />
        <AuthProvider>
          <main className="flex flex-col min-h-screen">
            <Header />
            <ClearClientState />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </main>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
