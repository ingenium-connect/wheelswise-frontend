'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";

interface MotorType {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const Value: React.FC = () => {
  const router = useRouter();
  const [selectedMotorType, setSelectedMotorType] = useState<MotorType | null>(null);
  const [vehicleValue, setVehicleValue] = useState("");
  const [error, setError] = useState("");



  useEffect(() => {
    // Get the selected motor type from localStorage
    const storedMotorType = localStorage.getItem('selectedMotorType');
    if (storedMotorType) {
      setSelectedMotorType(JSON.parse(storedMotorType));
    }
  }, []);

  const handleContinue = () => {
    if (!vehicleValue || isNaN(Number(vehicleValue)) || Number(vehicleValue) <= 0) {
      setError("Please enter a valid numeric value for your vehicle.");
      return;
    }

    setError(""); 
    
    // Store the vehicle value in localStorage
    localStorage.setItem('vehicleValue', vehicleValue);
    
    router.push("/motor-subtype");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#edf4f7] to-[#f4f9fb]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#397397] text-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 md:px-16 h-16">
          <button onClick={() => router.back()} className="hover:underline font-medium">
            ← Go Back
          </button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            Step Two: Enter Motor Vehicle Value
          </h1>
          <div className="w-24" />
        </div>
      </nav>

      {/* Card */}
      <div className="pt-24 pb-20 flex-grow flex justify-center items-center px-4">
        <div className="w-[384px] h-[192px] bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center">
          {selectedMotorType && (
            <div className="text-center text-gray-700 text-sm mb-3">
              Selected: <strong>{selectedMotorType.name}</strong>
            </div>
          )}

          {/* Input Group */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-700 mb-2 font-medium">
              Enter your vehicle value
            </label>
            <input
              type="number"
              placeholder="e.g. 800000"
              value={vehicleValue}
              onChange={(e) => setVehicleValue(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-[#397397]"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <button
              onClick={handleContinue}
              className="mt-4 bg-[#397397] hover:bg-[#2e5e74] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Value; 