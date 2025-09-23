"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";

const VehicleDetails = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleValue: "",
    engineCapacity: "",
    vehicleNumber: "",
    chassisNumber: "",
    make: "",
    model: "",
    year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vehicle Details Submitted:", form);
    router.push("/quote"); // Redirect or handle accordingly
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl p-8 rounded-tl-[40px] rounded-br-[40px]">
        <h2 className="text-2xl md:text-3xl text-primary font-bold text-center mb-4">
          Vehicle Details
        </h2>
        {/* <p className="text-center text-sm text-gray-600 mb-6">Enter the vehicles details</p> */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="number"
            name="vehicleValue"
            value={form.vehicleValue}
            onChange={handleChange}
            placeholder="Vehicle Value"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="engineCapacity"
            value={form.engineCapacity}
            onChange={handleChange}
            placeholder="Enter the Engine cc e.g. 1800CC"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="chassisNumber"
            value={form.chassisNumber}
            onChange={handleChange}
            placeholder="Chassis Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <select
            name="make"
            value={form.make}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          >
            <option value="">Select Make</option>
            <option value="Nissan">Nissan</option>
            <option value="Toyota">Toyota</option>
            <option value="Mazda">Mazda</option>
            <option value="Subaru">Subaru</option>
          </select>

          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="Vehicle Model"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          >
            <option value="">Year of Manufacture</option>
            {Array.from({ length: 30 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="text-white transition">
              Get Quote
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleDetails;
