"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";

const PersonalDetails = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    kraPin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] flex items-center justify-center px-4">
      {/* navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#397397] text-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 md:px-16 h-16">
          <button
            onClick={() => router.back()}
            className="hover:underline font-medium"
          >
            ← Go Back
          </button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            Step Five: Enter Personal details
          </h1>
          <div className="w-24" />
        </div>
      </nav>

      <div className="w-full max-w-2xl bg-white shadow-2xl p-8 rounded-tl-[40px] rounded-br-[40px]">
        <h2 className="text-2xl md:text-3xl text-primary font-bold text-center mb-4">
          Personal Details
        </h2>
        {/* <p className="text-center text-sm text-gray-600 mb-6">Enter the vehicles details</p> */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

           <input
            type="text"
            name="kraPin"
            value={form.kraPin}
            onChange={handleChange}
            placeholder="KRA PIN"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="text-white transition">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;
