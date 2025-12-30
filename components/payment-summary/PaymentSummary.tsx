"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentSummary = () => {
  const [paymentMethod, setPaymentMethod] = useState<"onetime" | "installment">(
    "installment"
  );
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const totalPayment = 111000;

  const addedBenefits: any[] = [
    { label: "Windscreen", amount: 26000 },
    { label: "Radio Cassette", amount: 31000 },
  ];

  const installments = [
    {
      label: "First Installment",
      amount: 70000,
    },
    {
      label: "Last Installment",
      amount: 91000,
    },
  ];

  const [date, setDate] = useState("");
  const today = new Date();

  return (
      <div className="max-w-2xl mx-auto">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <Card
            className={`p-8 cursor-pointer transition-all border-2 ${
              paymentMethod === "onetime"
                ? "border-[#2e5e74] bg-white/80"
                : "border-[#c7dde5] bg-white/60 hover:border-[#9fc3d1]"
            }`}
            onClick={() => setPaymentMethod("onetime")}
          >
            <h3 className="text-xl font-medium mb-4 text-[#2e5e74]">
              One Time
            </h3>
            <p className="text-sm text-[#4f6f7d] leading-relaxed">
              Pay the full amount in one go for hassle-free coverage.
            </p>
          </Card>

          <Card
            className={`p-8 cursor-pointer transition-all border-2 ${
              paymentMethod === "installment"
                ? "border-[#2e5e74] bg-white/80"
                : "border-[#c7dde5] bg-white/60 hover:border-[#9fc3d1]"
            }`}
            onClick={() => setPaymentMethod("installment")}
          >
            <h3 className="text-xl font-medium mb-4 text-[#2e5e74]">
              Installment
            </h3>
            <p className="text-sm text-[#4f6f7d] leading-relaxed mb-6">
              Pay the full amount in 2 installments.
            </p>
          </Card>
        </div>

        {/* Policy Details */}
        <div className="mb-8">
          {/* Plan Details */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center text-color-dark">
              Your Policy Details
            </h3>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 text-primary">
                Added Benefits
              </h4>
              {addedBenefits.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-4 py-2 rounded-lg mb-2 bg-[#e6f4f1] border-primary text-color-dark"
                >
                  <span>{item.label}</span>
                  <span>Ksh {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Payment */}
          {paymentMethod === "onetime" ? (
            <div className="rounded-xl shadow-inner p-6 w-full text-center bg-[#ebf2f4]">
              <h3 className="text-xl font-bold text-gray-700">TOTAL PAYMENT</h3>
              <p className="text-3xl font-extrabold mt-2 text-priamry">
                KES {totalPayment.toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-8">
              {installments.map((installment, id) => (
                <div
                  className="rounded-xl shadow-inner p-6 w-full text-center bg-[#ebf2f4]"
                  key={id}
                >
                  <h3 className="text-xl font-bold text-gray-700">
                    {installment.label}
                  </h3>
                  <p className="text-3xl font-extrabold mt-2 text-priamry">
                    {installment.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Registration */}
        <div className="mb-8 text-center">
          <p className="text-[#6b8b98] text-sm mb-2">
            Vehicle Registration Number
          </p>
          <p className="text-2xl font-medium text-[#2e5e74]">KBV 112_4</p>
        </div>

        {/* Cover Start Date */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-xl text-center shadow-md w-full">
            <label className="block text-center text-[#6b8b98] text-sm mb-4">
              COVER START DATE
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={formatDate(today)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-6 text-sm border-[#9fc3d1] text-[#2e5e74] hover:bg-[#e5f0f3]"
          >
            Back
          </Button>
          <Button className="flex-1 py-6 text-sm bg-[#2e5e74] text-white hover:bg-[#244c5f] font-medium">
            Proceed
          </Button>
        </div>
      </div>
  );
};

export default PaymentSummary;
