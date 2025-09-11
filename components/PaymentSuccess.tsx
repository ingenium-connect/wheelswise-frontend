"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccess = () => {
  const primary = "#397397";
  const primaryDark = "#2e5e74";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f7f9fb]">
      {/* Success Message */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <CheckCircle
            className="text-green-500 mx-auto mb-4"
            size={64}
            strokeWidth={1.5}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Recieved Successfully!!
          </h2>
          <p className="text-gray-600 mb-6">
            Check your email to generate your certificate. Thank you for
            choosing WheelsWise!
          </p>
          <Link
            href="/"
            className="w-full py-2 px-4 rounded-lg text-white font-medium"
            style={{ backgroundColor: primary }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                primaryDark;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = primary;
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
