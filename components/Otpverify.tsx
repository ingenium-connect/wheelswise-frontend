"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { axiosClient } from "@/utilities/axios-client";
import { OTP_VERIFY_ENDPOINT } from "@/utilities/endpoints";
import { useOtp } from "@/hooks/useOtp";
import { toast } from "sonner";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";
import { useUserStore } from "@/stores/userStore";

// Optional – tiny shake animation
const shakeClass =
  "animate-[shake_0.3s_ease-in-out] @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}";

const OtpVerify: React.FC = () => {
  const { personalDetails } = usePersonalDetailsStore();
  const { profile } = useUserStore();
  const { sendOtp, timeUntilResend } = useOtp();

  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend timer
  const [timer, setTimer] = useState(60);
  const [allowResend, setAllowResend] = useState(false);

  // Shake animation state
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setAllowResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const resendOtp = () => {
    setAllowResend(false);
    (async () => {
      try {
        const res = await sendOtp(personalDetails.idNumber);
        if (res.ok) {
          setTimer(Math.ceil(OTP_RESEND_WINDOW_MS / 1000));
        } else if (res.reason === "recently-sent") {
          toast.success("OTP already sent recently");
          const until = timeUntilResend(personalDetails.idNumber);
          setTimer(Math.ceil(until / 1000));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to resend OTP");
        setAllowResend(true);
      }
    })();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError("Please enter all 6 digits.");

      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 300);

      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        user_id: profile?.id ?? "",
        otp: otp,
        user_type: "CUSTOMER",
      };

      const res = await axiosClient.patch(OTP_VERIFY_ENDPOINT, payload);

      const data = res?.data;

      if (data) {
        toast.success("OTP successfully verified");
        router.push("/dashboard/payment-summary");
      } else {
        retryOtp();
      }
    } catch (err) {
      retryOtp();

      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const retryOtp = () => {
    setAllowResend(true);
    setTimer(10);
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <span className="text-xl">📱</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your phone
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
                "Verify"
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              {allowResend ? (
                <span
                  className="text-primary font-medium cursor-pointer hover:underline"
                  onClick={resendOtp}
                >
                  Resend
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Resend in {timer}s
                </span>
              )}
            </p>
            <p className="text-sm">
              <span className="text-primary cursor-pointer hover:underline">
                Verify using Email instead
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
