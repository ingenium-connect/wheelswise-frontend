"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useInsuranceStore } from "@/store/store";

const PersonalDetails = () => {
  const router = useRouter();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    kraPin: "",
  });

  useEffect(() => {
    setCoverStep(5);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl p-8 rounded-tl-[40px] rounded-br-[40px]">
        <h2 className="text-2xl md:text-3xl text-primary font-bold text-center mb-4">
          Personal Details
        </h2>

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
