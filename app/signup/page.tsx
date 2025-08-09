'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Footer from "../../components/Footer";

interface SignupForm {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const primary = "#397397";
  const primaryDark = "#2e5e74";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log("Saving step data:", form);
    setError("");
    router.push("/next-step");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3]">
      <div
        className="w-full sticky top-0 z-50 text-white text-lg font-semibold text-center py-4 shadow-md"
        style={{ backgroundColor: primary }}
      >
        Step x: Create an account with us
      </div>

      {/* Form Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="WheelsWise Logo"
              width={112}
              height={112}
              className="h-24 md:h-28 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <h2
            className="text-2xl md:text-3xl font-extrabold text-center mb-2"
            style={{ color: primary }}
          >
            Create Account With Us
          </h2>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+254712345678"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-lg font-semibold transition"
              style={{ backgroundColor: primary }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = primaryDark;
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = primary;
              }}
            >
              Save
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              className="text-blue-700 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup; 