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
import { Loader2, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const id = nationalId.trim();
    if (!id) {
      setError("Please enter your national ID number.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post(RESET_PASSWORD_ENDPOINT, {
        national_id: id,
        user_type: "CUSTOMER",
      });

      toast.success("OTP sent to your registered phone number.");
      router.push(
        `/forgot-password/verify?national_id=${encodeURIComponent(id)}`,
      );
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.error ??
            err.response?.data?.message ??
            "Failed to send OTP. Please try again.",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="WheelsWise Logo"
              width={96}
              height={96}
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-[#1e3a5f] mb-1">
            Reset Your PIN
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            We&apos;ll send a verification code to your registered phone number.
          </p>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                National ID Number
              </label>
              <input
                type="text"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#d7e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                placeholder="e.g. 12345678"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Code
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
