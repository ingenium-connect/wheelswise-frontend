"use client";

import React, { useState, FormEvent, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { otpAction } from "@/app/actions/otp";
import { axiosClient } from "@/utilities/axios-client";
import { toast } from "sonner";

// Optional – tiny shake animation
const shakeClass =
  "animate-[shake_0.3s_ease-in-out] @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}";

const DUMMY_NUMBERS = ["700454757", "706927928", "785324799"];

const OtpVerify: React.FC = () => {
  const { personalDetails } = usePersonalDetailsStore();

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
    axiosClient
      .post("otp", {
        msisdn: getPhoneNumber,
        user_type: "CUSTOMER",
      })
      .then((res) => {
        toast.success("OTP resent successfully");
      })
      .catch((err) => {
        console.error(err);
      });

    setTimer(60);
  };

  const getPhoneNumber = useMemo(() => {
    const current = personalDetails.phoneNumber;

    // Extract the last 9 digits (e.g., "700454757")
    const normalizedInput = current.slice(-9);

    if (DUMMY_NUMBERS.includes(normalizedInput)) return current;

    return DUMMY_NUMBERS[Math.floor(Math.random() * DUMMY_NUMBERS.length)];
  }, [personalDetails.phoneNumber]);

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
      // TODO: use dummy phone number
      const payload = {
        msisdn: getPhoneNumber,
        user_type: "CUSTOMER",
        otp: otp,
      };

      const response = await otpAction(payload);

      if (response) {
        toast.success("OTP sent successfully");

        router.push("/dashboard/payment-summary");
      } else {
        setAllowResend(true);
        setTimer(10);

        setError("Invalid OTP");

        // Trigger shake animation for invalid OTP
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    } catch (err) {
      setAllowResend(true);

      setError("Network error. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-primary mb-2">
            OTP Verification
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter the 6-digit code sent to your phone number
          </p>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`flex justify-center ${shake ? shakeClass : ""}`}
                >
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

                {/* Button skeleton loading */}
                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-pulse flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/50"></div>
                      <div className="w-4 h-4 rounded-full bg-white/50"></div>
                      <div className="w-4 h-4 rounded-full bg-white/50"></div>
                    </div>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>

              {/* Resend Timer */}
              <p className="text-sm text-center text-gray-600 mt-4">
                Didn’t receive code?{" "}
                {allowResend ? (
                  <span
                    className="text-blue-700 font-medium cursor-pointer hover:underline"
                    onClick={resendOtp}
                  >
                    Resend
                  </span>
                ) : (
                  <span className="text-gray-400">Resend in {timer}s</span>
                )}
              </p>

              {/* Alternative verification */}
              <p className="text-center mt-4 text-sm">
                <span className="text-primary cursor-pointer hover:underline">
                  Verify using Email instead
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
