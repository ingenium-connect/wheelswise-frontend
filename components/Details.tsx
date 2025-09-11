"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Details = () => {
  const router = useRouter();
  const primary = "#397397";
  const primaryDark = "#2e5e74";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    kraPin: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    router.push("/next-step");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-tl-[40px] rounded-br-[40px] shadow-2xl">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-6"
          style={{ color: primary }}
        >
          Personal Details
        </h2>

        <form
          onSubmit={handleNext}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <input
              type="text"
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KRA Pin
            </label>
            <input
              type="text"
              name="kraPin"
              value={form.kraPin}
              onChange={handleChange}
              placeholder="Enter your KRA pin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Go back
            </button>

            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg font-semibold transition"
              style={{ backgroundColor: primary }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  primaryDark)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  primary)
              }
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Details;
