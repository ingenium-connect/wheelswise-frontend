"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f7f9fb]">
      {/* Top Navbar */}
      <div className="w-full sticky top-0 z-50 text-white text-lg font-semibold bg-primary text-center py-4 shadow-md">
        Choose a Payment Method
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center py-10 px-4">
        {/* Method Selection */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mb-8">
          <h2 className="text-lg font-semibold text-center mb-4">
            Choose Payment Method
          </h2>
          <div className="flex justify-center gap-4">
            {/* Mpesa */}
            <div
              className={`flex flex-col items-center border rounded-xl p-4 w-1/2 cursor-pointer ${
                selectedMethod === "mpesa"
                  ? "border-[color:var(--tw-shadow-color)] shadow-lg"
                  : "border-gray-300"
              }`}
              onClick={() => handleChoose("mpesa")}
            >
              <Image
                src="mpesa.png"
                alt="Mpesa"
                height={12}
                width={12}
                className="h-12 mb-2 object-contain"
              />
              <Image
                src="mpesa.png"
                alt="Mpesa"
                height={12}
                width={12}
                className="h-12 mb-2 object-contain"
              />
              <span className="font-medium">Mpesa</span>

              <Button
                className={`text-white transition mt-2 ${
                  selectedMethod === "mpesa" ? "bg-primary" : "bg-[#ccc]"
                }`}
              >
                Choose
              </Button>
            </div>

            {/* Card */}
            <div
              className={`flex flex-col items-center border rounded-xl p-4 w-1/2 cursor-pointer ${
                selectedMethod === "card"
                  ? "border-[color:var(--tw-shadow-color)] shadow-lg"
                  : "border-gray-300"
              }`}
              onClick={() => handleChoose("card")}
            >
              <Image
                src="visa.png"
                alt="Card"
                height={12}
                width={12}
                className="h-12 mb-2 object-contain"
              />

              <span className="font-medium">Card</span>
              <Button
                className={`text-white transition mt-2 ${
                  selectedMethod === "card" ? "bg-primary" : "bg-[#ccc]"
                }`}
              >
                Choose
              </Button>
            </div>
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

            <Button onClick={handlePay} className="text-white transition mb-3">
              Pay
            </Button>

            <Button
              onClick={handlePay}
              className="text-white transition bg-[#ccc]"
            >
              Confirm Payment
            </Button>
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
    </div>
  );
};

export default PaymentMethod;
