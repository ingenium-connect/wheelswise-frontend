import Login from "@/components/auth/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In to Your Account",
  description:
    "Log in to your Wheelswise account to view your motor insurance policies, download certificates, and manage your vehicles.",
  alternates: { canonical: "/login" },
};

export default function Page() {
  return <Login />;
}
