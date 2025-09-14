"use client";

import React, {
  useRef,
  useState,
  FormEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import StepNav from "./StepNav";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const OtpVerify: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 6) {
      const pasteArray = pasteData.split("").slice(0, 6);
      setOtp(pasteArray);
      pasteArray.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: enteredOtp }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("OTP verified:", result);
        router.push("/"); // ✅ fixed redirect
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3]">
      <StepNav />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-primary mb-2">
            OTP Verification
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter the 6-digit code sent to your phone number
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-red-600 text-sm">{error}</p>
            )}

            <Button type="submit" className="text-white transition">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Didn’t receive code?{" "}
            <span
              className="text-blue-700 font-medium cursor-pointer hover:underline"
              onClick={() => console.log("Resend OTP")}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
