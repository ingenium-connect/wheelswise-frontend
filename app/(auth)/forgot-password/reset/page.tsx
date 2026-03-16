"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { axiosClient } from "@/utilities/axios-client";
import { ACCOUNT_RESET_ENDPOINT } from "@/utilities/endpoints";
import { useUserStore } from "@/stores/userStore";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPinPage() {
  return (
    <Suspense>
      <ResetPinForm />
    </Suspense>
  );
}

function ResetPinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nationalId = searchParams.get("national_id") ?? "";

  const { profile } = useUserStore();
  const isLoggedIn = !!profile?.id;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!nationalId) {
      router.replace("/forgot-password");
    }
  }, [nationalId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("PIN must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("PINs do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post(ACCOUNT_RESET_ENDPOINT, {
        national_id: nationalId,
        password,
        confirm_password: confirmPassword,
        user_type: "CUSTOMER",
      });

      toast.success("PIN reset successfully. Please log in with your new PIN.");
      // Always sign out — the backend invalidates the existing token on PIN reset.
      // If still logged in, hit the logout endpoint to clear the server cookie first.
      if (isLoggedIn) {
        await fetch("/api/logout").catch(() => null);
      }
      router.push("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.error ??
            err.response?.data?.message ??
            "Failed to reset PIN. Please try again.",
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
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-[#1e3a5f] mb-1">
            Set New PIN
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Choose a new PIN for your account.
          </p>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-[#d7e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  placeholder="Enter new PIN"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide PIN" : "Show PIN"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New PIN
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-[#d7e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  placeholder="Confirm new PIN"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide PIN" : "Show PIN"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset PIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
