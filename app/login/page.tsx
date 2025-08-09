'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const primary = "#397397";
  const primaryDark = "#2e5e74";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with", form);
    router.push("/");
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
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
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2" style={{ color: primary }}>
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Login to continue managing your motor insurance.
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

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
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
            Login
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm hover:underline"
              style={{ color: primary }}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-700 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/motor-type")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login; 