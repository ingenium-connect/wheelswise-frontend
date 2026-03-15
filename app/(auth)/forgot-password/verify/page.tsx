"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { axiosClient } from "@/utilities/axios-client";
import {
  OTP_VERIFY_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "@/utilities/endpoints";
import { useUserStore } from "@/stores/userStore";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";
import { Loader2 } from "lucide-react";

const shakeClass =
  "animate-[shake_0.3s_ease-in-out] @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}";

export default function ResetPinVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nationalId = searchParams.get("national_id") ?? "";

  const { profile } = useUserStore();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(60);
  const [allowResend, setAllowResend] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!nationalId) {
      router.replace("/forgot-password");
    }
  }, [nationalId, router]);

  useEffect(() => {
    if (timer === 0) {
      setAllowResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const handleResend = async () => {
    setResending(true);
    setAllowResend(false);
    try {
      await axiosClient.post(RESET_PASSWORD_ENDPOINT, {
        national_id: nationalId,
        user_type: "CUSTOMER",
      });
      toast.success("OTP resent successfully.");
      setTimer(Math.ceil(OTP_RESEND_WINDOW_MS / 1000));
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
      setAllowResend(true);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: Record<string, string> = {
        national_id: nationalId,
        otp,
        user_type: "CUSTOMER",
      };

      if (profile?.id) {
        payload.user_id = profile.id;
      }

      await axiosClient.patch(OTP_VERIFY_ENDPOINT, payload);

      toast.success("OTP verified successfully.");
      router.push(
        `/forgot-password/reset?national_id=${encodeURIComponent(nationalId)}`,
      );
    } catch (err: unknown) {
      triggerShake();
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.error ??
            err.response?.data?.message ??
            "Invalid OTP. Please try again.",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />

        <div className="p-8 space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="WheelsWise Logo"
              width={96}
              height={96}
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <span className="text-xl">📱</span>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">
              Verify Your Identity
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your registered phone number.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className={`flex justify-center ${shake ? shakeClass : ""}`}>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError("");
                }}
              >
                <InputOTPGroup>
                  {[0, 1, 2].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
                <InputOTPGroup>
                  {[3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-center text-red-600 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              {allowResend ? (
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResend}
                  className="text-primary font-medium hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {resending && <Loader2 className="w-3 h-3 animate-spin" />}
                  Resend
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in {timer}s
                </span>
              )}
            </p>
            <p className="text-sm">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-primary hover:underline"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
