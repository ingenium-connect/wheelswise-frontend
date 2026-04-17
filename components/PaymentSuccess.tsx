"use client";
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useInsuranceFlowStore } from "@/stores/insuranceFlowStore";

const PaymentSuccess = () => {
  const resetFlow = useInsuranceFlowStore((s) => s.resetFlow);

  useEffect(() => {
    // Clean up flow state after successful payment
    resetFlow();

    // Clean up the existing-vehicle shortcut flag
    if (typeof window !== "undefined") {
      localStorage.removeItem("insure_existing_vehicle");
    }

    console.log("[PaymentSuccess] Flow state cleared after successful payment");
  }, [resetFlow]);

  return (
    <div className="mt-5 sm:mt-[10rem] flex flex-col justify-between">
      {/* Success Message */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <CheckCircle
            className="text-green-500 mx-auto mb-4"
            size={64}
            strokeWidth={1.5}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Received Successfully!!
          </h2>
          <p className="text-gray-600 mb-6">
            Check your email for your vehicle sticker. Thank you for choosing
            us!
          </p>
          <Link
            href="/dashboard"
            className="w-full py-2 px-4 rounded-lg text-white font-medium bg-primary hover:bg-primary-dark active:bg-primary-dark transition inline-block text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
