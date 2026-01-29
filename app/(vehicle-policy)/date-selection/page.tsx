"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const DateSelection: React.FC = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleNext = () => {
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }

    // Store the selected date in localStorage
    localStorage.setItem("policyStartDate", startDate);
    router.push("/payment-summary");
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#f7f9fb]">
      {/* Navbar */}
      <div className="w-full sticky top-0 z-50 text-white text-lg font-semibold text-center py-4 shadow-md px-4 bg-[#397397]">
        <button
          onClick={() => router.back()}
          className="text-sm bg-white text-gray-700 px-3 py-1 rounded-lg shadow"
        >
          Back
        </button>
        <span className="mx-auto">Step X: Select Policy Start Date</span>
      </div>

      {/* Content */}
      <div className="flex-grow px-4 py-10 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#2e5e74]">
          Policy Start Date
        </h2>

        <p className="text-red-600 text-sm mb-6 text-center max-w-md">
          NB: Vehicle valuation is mandatory for comprehensive products
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Start Date (within 7 days from today)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={formatDate(today)}
            max={formatDate(maxDate)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#397397]"
          />
        </div>

        <button
          onClick={handleNext}
          className="mt-8 bg-[#397397] hover:bg-[#2e5e74] text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateSelection;
