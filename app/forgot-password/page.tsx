"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    alert("If this email exists, a reset link has been sent.");
    router.push("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="WheelsWise Logo"
            width={96}
            height={96}
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2 text-primary">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your registered email to receive a reset link.
        </p>

        {/* Reset Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-primary"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full transition">
            Send Reset Link
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          <Link
            href="/login"
            className="font-medium cursor-pointer hover:underline text-primary"
          >
            Go back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
