"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { axiosClient } from "@/utilities/axios-client";
import { RESET_PASSWORD_ENDPOINT } from "@/utilities/endpoints";
import { Loader2 } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [msisdn, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const payment_method_id =
        typeof window !== "undefined"
          ? window.localStorage.getItem("payment_method_id")
          : null;

      const payload = {
        msisdn,
      };
      const res = await axiosClient.post(RESET_PASSWORD_ENDPOINT, payload, {});

      const data = res?.data;

      if (res?.data?.error) {
        setError(res?.data?.error ?? "Payment failed. Please try again.");
      }
      if (data) {
        toast.success("Mpesa payment successful");
        setTimeout(() => {
          router.push("/dashboard/payment-summary");
        }, 2000);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err?.response?.data?.error ?? "Network error. Please try again.",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="WheelsWise Logo"
            width={96}
            height={96}
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2 text-primary">
          Forgot Your Password?
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your registered phone number to receive a reset link.
        </p>

        {/* Reset Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="tel"
              required
              value={msisdn}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-primary"
              placeholder="e.g. 254712345678"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full transition"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          <Link
            href="/login"
            className="font-medium cursor-pointer hover:underline text-primary"
          >
            Go back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
