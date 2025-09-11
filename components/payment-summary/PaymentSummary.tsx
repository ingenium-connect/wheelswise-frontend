"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../layout/Footer";

interface PaymentType {
  key: string;
  label: string;
  description: string;
}

interface AddedBenefit {
  label: string;
  amount: number;
}

const PaymentSummary: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("one-time");

  const primaryColor = "#397397";
  const primaryDark = "#2e5e74";

  const paymentTypes: PaymentType[] = [
    {
      key: "one-time",
      label: "One-time Payment",
      description: "Pay the full amount in one go for hassle-free coverage.",
    },
    {
      key: "installments",
      label: "Lipa Pole Pole",
      description: "Pay the full amount in 2 installments.",
    },
    {
      key: "daily",
      label: "Pay Per Day",
      description: "Flexible daily payments tailored to your needs.",
    },
  ];

  const addedBenefits: AddedBenefit[] = [
    { label: "Windscreen", amount: 26000 },
    { label: "Radio Cassette", amount: 31000 },
  ];

  const totalPayment = 111000;

  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#f7f9fb]">
      {/* Navbar */}
      <div
        className="w-full sticky top-0 z-50 text-white text-lg font-semibold text-center py-4 shadow-md flex items-center justify-between px-4"
        style={{ backgroundColor: primaryColor }}
      >
        <button
          onClick={() => router.back()}
          className="text-sm bg-white text-gray-700 px-3 py-1 rounded-lg shadow"
        >
          Back
        </button>
        <span className="flex-1 text-center">Step X: Payment Summary</span>
        <span className="w-[60px]"></span>
      </div>

      {/* Main content */}
      <div className="flex-grow px-4 py-10 flex flex-col items-center">
        {/* Page Title */}
        <h2
          className="text-2xl font-semibold text-center mb-2"
          style={{ color: primaryDark }}
        >
          Payment Summary
        </h2>
        <p className="text-red-600 text-sm mb-6 text-center">
          NB: Vehicle valuation is mandatory for comprehensive products
        </p>

        {/* Payment Type Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mb-8">
          <h3
            className="text-lg font-semibold mb-4 text-center"
            style={{ color: primaryDark }}
          >
            Choose Your Payment Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {paymentTypes.map((type) => (
              <div
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`border rounded-lg p-4 cursor-pointer text-center transition-all duration-200 ${
                  selectedType === type.key
                    ? "shadow-md border-[3px]"
                    : "border border-gray-300"
                }`}
                style={{
                  borderColor:
                    selectedType === type.key ? primaryColor : "#ccc",
                }}
              >
                <div
                  className="w-5 h-5 mx-auto rounded-full mb-2"
                  style={{
                    backgroundColor:
                      selectedType === type.key ? primaryColor : "#e5e7eb",
                  }}
                />
                <h4 className="font-medium text-gray-800">{type.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                {selectedType === type.key && (
                  <div
                    className="mt-2 font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mb-8">
          <h3
            className="text-lg font-semibold mb-4 text-center"
            style={{ color: primaryDark }}
          >
            Your Plan Details
          </h3>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2" style={{ color: primaryColor }}>
              Added Benefits
            </h4>
            {addedBenefits.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between px-4 py-2 rounded-lg mb-2"
                style={{
                  backgroundColor: "#e6f4f1",
                  color: primaryDark,
                  border: `1px solid ${primaryColor}`,
                }}
              >
                <span>{item.label}</span>
                <span>Ksh {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Payment */}
        <div
          className="rounded-xl shadow-inner p-6 w-full max-w-xl text-center"
          style={{ backgroundColor: "#ebf2f4" }}
        >
          <h3 className="text-xl font-bold text-gray-700">TOTAL PAYMENT</h3>
          <p
            className="text-3xl font-extrabold mt-2"
            style={{ color: primaryColor }}
          >
            KES {totalPayment.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
