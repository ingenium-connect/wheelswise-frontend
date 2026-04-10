"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { axiosClient } from "@/utilities/axios-client";
import { OTP_VERIFY_ENDPOINT } from "@/utilities/endpoints";
import axios from "axios";
import { useOtp } from "@/hooks/useOtp";
import { toast } from "sonner";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";
import { useUserStore } from "@/stores/userStore";

const PENDING_VEHICLE_KEY = "__pending_vehicle_payload__";

// Optional – tiny shake animation
const shakeClass =
  "animate-[shake_0.3s_ease-in-out] @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}";

const OtpVerify: React.FC = () => {
  const { personalDetails } = usePersonalDetailsStore();
  const { profile } = useUserStore();
  const { sendOtp, timeUntilResend } = useOtp();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoginFlow = searchParams.get("from") === "login";
  const loginNationalId = isLoginFlow
    ? typeof window !== "undefined"
      ? (sessionStorage.getItem("__login_national_id__") ?? "")
      : ""
    : "";

  // Logged-in "new vehicle" flow: has product_type/motor_type params, not login flow,
  // and no pending vehicle payload (guest signup sets that before OTP)
  const flowProductType = searchParams.get("product_type");
  const flowMotorType = searchParams.get("motor_type");
  const hasPendingVehicle =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem(PENDING_VEHICLE_KEY);
  const isNewVehicleFlow =
    !isLoginFlow && !!flowProductType && !!flowMotorType && !hasPendingVehicle;

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
    const nationalId = isLoginFlow
      ? loginNationalId
      : personalDetails.secondary_user
        ? personalDetails.secondary_user.idNumber
        : personalDetails.user.idNumber;
    setAllowResend(false);
    (async () => {
      try {
        const res = await sendOtp(nationalId);
        if (res.ok) {
          setTimer(Math.ceil(OTP_RESEND_WINDOW_MS / 1000));
        } else if (res.reason === "recently-sent") {
          toast.success("OTP already sent recently");
          const until = timeUntilResend(nationalId);
          setTimer(Math.ceil(until / 1000));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to resend OTP. Please try again.");
        setAllowResend(true);
      }
    })();
  };

  const registerPendingVehicle = async () => {
    const raw = sessionStorage.getItem(PENDING_VEHICLE_KEY);
    if (!raw) return;

    try {
      await axios.post("/api/vehicle/new", JSON.parse(raw));
      sessionStorage.removeItem(PENDING_VEHICLE_KEY);
    } catch (err) {
      console.error("Vehicle registration failed:", err);
      toast.error(
        "Vehicle registration failed. Please try again from the dashboard.",
      );
    }
  };

  const verifyOtp = async (otpValue: string) => {
    if (otpValue.length < 6 || loading) return;

    setLoading(true);
    setError("");

    try {
      const payload = isLoginFlow
        ? { national_id: loginNationalId, otp: otpValue, user_type: "CUSTOMER" }
        : { user_id: profile?.id ?? "", otp: otpValue, user_type: "CUSTOMER" };

      const res = await axiosClient.patch(OTP_VERIFY_ENDPOINT, payload);

      const data = res?.data;

      if (data) {
        toast.success("OTP successfully verified");
        if (isLoginFlow) {
          sessionStorage.removeItem("__login_national_id__");
          router.push("/login");
        } else if (isNewVehicleFlow) {
          // Logged-in user adding a new vehicle — continue to vehicle value
          router.push(
            `/vehicle-value?product_type=${flowProductType}&motor_type=${flowMotorType}`,
          );
        } else {
          await registerPendingVehicle();
          router.push("/dashboard/payment-summary");
          router.refresh();
        }
      } else {
        retryOtp();
      }
    } catch (_err) {
      retryOtp();

      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    await verifyOtp(otp);
  };

  const handleOtpChange = (val: string) => {
    setOtp(val);
    if (error) setError("");
    if (val.length === 6) {
      verifyOtp(val);
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
              <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
