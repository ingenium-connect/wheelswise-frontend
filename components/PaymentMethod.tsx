"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

const methods = [
  {
    id: "mpesa",
    label: "Mpesa",
    description: "Pay instantly using your mobile wallet.",
    image: "/mpesa.png",
  },
  {
    id: "card",
    label: "Card",
    description: "Secure payment via debit or credit card.",
    image: "/card.png",
  },
];

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChoose = (method: string) => {
    setSelectedMethod(method);
  };

  const handlePay = () => {
    if (selectedMethod === "mpesa") {
      alert(`Initiating Mpesa payment for ${phoneNumber}`);
    } else {
      alert("Card payments coming soon!");
    }
  };

  const handleCardDetailsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center px-4">
        {/* Method Selection */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mb-8">
          <h2 className="text-lg font-semibold text-center mb-4">
            Choose Payment Method
          </h2>
          <div
            className="flex justify-center gap-4"
            role="radiogroup"
            aria-label="Payment method"
          >
            {methods.map((method) => {
              const isSelected = selectedMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleChoose(method.id)}
                  className={`
          relative w-1/2 rounded-2xl border p-6 text-center
          backdrop-blur-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#2e5e74]/40
          ${
            isSelected
              ? "border-[#2e5e74] bg-white/80 shadow-md scale-[1.01]"
              : "border-[#c7dde5] bg-white/60 hover:bg-white/70 hover:border-[#9fc3d1]"
          }
        `}
                >
                  {/* Check Indicator */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#2e5e74] text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}

                  <img
                    src={method.image}
                    alt={method.label}
                    className="mx-auto mb-4 h-12 object-contain"
                  />

                  <h3 className="text-base font-medium text-[#2e5e74]">
                    {method.label}
                  </h3>

                  <p className="mt-1 text-sm text-[#6b8b98]">
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mpesa Form */}
        {selectedMethod === "mpesa" && (
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-primary mb-2">Mpesa</h3>
            <p className="text-sm text-gray-600 mb-4">
              You will receive a push notification to your phone number.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="07XXXXXXXX"
              className="w-full border border-primary rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring focus:border-[color:var(--tw-shadow-color)]"
            />

            <div className="flex gap-3">
              <Button
                onClick={handlePay}
                className="text-white transition mb-3"
              >
                Pay
              </Button>

              <Button
                onClick={handlePay}
                className="text-white transition bg-[#ccc]"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}

        {/* Card Form (Disabled for now) */}
        {selectedMethod === "card" && (
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md opacity-70 pointer-events-none relative">
            <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-700 text-center py-2 rounded-t-xl text-sm font-medium">
              Card payments coming soon
            </div>

            <h3 className="text-lg font-semibold textr-primary mt-6 mb-2">
              Card Payment
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your card details below to complete the payment.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              name="cardNumber"
              onChange={handleCardDetailsChange}
              disabled
              className="w-full border rounded-lg px-4 py-2 mb-4 bg-gray-100 text-gray-500"
            />

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  name="expiry"
                  onChange={handleCardDetailsChange}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  name="cvv"
                  onChange={handleCardDetailsChange}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                />
              </div>
            </div>
            <Button
              disabled
              className="text-white w-full transition mb-3 cursor-not-allowed"
            >
              Pay
            </Button>

            <Button
              disabled
              className="text-white transition w-full cursor-not-allowed"
            >
              Confirm Payment
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentMethod;
