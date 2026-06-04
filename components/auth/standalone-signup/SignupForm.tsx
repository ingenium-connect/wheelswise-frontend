"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
  IdCard,
  Mail,
  Pin,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

import { FinalUserPayload, UserPayload } from "@/types/data";
import axios, { isAxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Password strength checker
const getPasswordStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "text-red-500" };
  if (score <= 4)
    return { score: score - 1, label: "Medium", color: "text-yellow-600" };
  return { score: score - 1, label: "Strong", color: "text-green-600" };
};

// Validation schema for standalone signup
const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    msisdn: z
      .string()
      .min(10, "Valid phone number is required")
      .regex(
        /^(254|\+254|0)[0-9]{9,10}$/,
        "Please enter a valid phone number (e.g., 0712 345 678 or 254712345678)",
      ),
    idNumber: z
      .string()
      .min(1, "ID number is required")
      .max(20, "ID number is too long"),
    email: z
      .string()
      .email("Valid email is required")
      .min(1, "Email is required"),
    kraPin: z
      .string()
      .min(1, "KRA PIN is required")
      .regex(
        /^[A-Z][0-9]{9}[A-Z]$/,
        "Please enter a valid KRA PIN (e.g., A1234567890B)",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]).+$/,
        "Password must contain letters, numbers, and special characters",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;
type Props = React.ComponentProps<typeof Card>;

const StandaloneSignupForm: React.FC<Props> = ({ ...props }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [_password, setPassword] = useState("");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      msisdn: "",
      idNumber: "",
      email: "",
      kraPin: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const passwordValue = watch("password");
  const passwordStrength = getPasswordStrength(passwordValue);

  function extractSignupError(err: unknown): string {
    if (isAxiosError(err)) {
      const raw =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.detail;
      if (raw) return friendlySignupError(String(raw));
    }
    if (err instanceof Error) return friendlySignupError(err.message);
    return "Something went wrong. Please try again.";
  }

  function friendlySignupError(raw: string): string {
    const msg = raw.replace(/^Failed to fetch data:\s*/i, "").trim();
    const lower = msg.toLowerCase();
    if (
      lower.includes("already exists") ||
      lower.includes("already registered") ||
      lower.includes("duplicate")
    )
      return "An account with these details already exists. Please log in instead.";
    if (
      lower.includes("phone") &&
      (lower.includes("invalid") || lower.includes("format"))
    )
      return "The phone number format is invalid. Please use the format 07XX XXX XXX or 2547XX XXX XXX.";
    if (
      lower.includes("national_id") ||
      lower.includes("id number") ||
      lower.includes("identifier")
    )
      return "The ID number provided is invalid or already in use.";
    if (lower.includes("password") && lower.includes("short"))
      return "Password must be at least 8 characters.";
    if (lower.includes("token missing") || lower.includes("token"))
      return "Registration failed. Please check your details and try again.";
    if (lower.includes("network") || lower.includes("fetch"))
      return "Network error. Please check your connection and try again.";
    if (msg.length < 120 && !msg.includes("status code")) return msg;
    return "Registration failed. Please check your details and try again.";
  }

  const handleSignup = async (data: SignupFormValues) => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setSignupError("");

    try {
      const userPayload: UserPayload = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        msisdn: data.msisdn.trim(),
        id_number: data.idNumber.trim(),
        email: data.email.trim(),
        kra_pin: data.kraPin.trim(),
        password: data.password,
        confirm_password: data.confirmPassword,
        user_type: "CUSTOMER",
      };

      const finalUserPayload: FinalUserPayload = {
        source: "",
        source_vehicle_reg_number: "",
        user: userPayload,
      };

      const res = await axios.post("/api/signup", {
        userPayload: finalUserPayload,
      });

      if (res?.data?.user?.id) {
        // Store user data for OTP verification
        const userData = res.data.user;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("__signup_user_id__", userData.id);
          sessionStorage.setItem("__signup_msisdn__", userData.msisdn);
        }

        toast.success("Account created successfully!");
        router.push(
          `/otp-verify?product_type=COMPREHENSIVE&motor_type=PRIVATE&from=signup`,
        );
        router.refresh();
      } else {
        throw new Error("Registration failed - no user ID returned");
      }
    } catch (error) {
      setSignupError(extractSignupError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="border border-[#d7e8ee] shadow-lg overflow-hidden"
      {...props}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
          {signupError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{signupError}</span>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3a5f]">
              Create Your Account
            </h2>
            <p className="text-sm text-muted-foreground">
              Join thousands of satisfied customers
            </p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#1e3a5f] uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                  className={
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">
                  <User className="w-4 h-4 inline mr-1" />
                  Last Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                  className={
                    errors.lastName ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </Field>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#1e3a5f] uppercase tracking-wider">
              Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="msisdn">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="msisdn"
                  {...register("msisdn")}
                  placeholder="0712 345 678"
                  className={
                    errors.msisdn ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.msisdn && (
                  <p className="text-sm text-red-500">
                    {errors.msisdn.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className={
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </Field>
            </div>
          </div>

          {/* Identity Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#1e3a5f] uppercase tracking-wider">
              Identity & Tax
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="idNumber">
                  <IdCard className="w-4 h-4 inline mr-1" />
                  ID / Passport Number <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="idNumber"
                  {...register("idNumber")}
                  placeholder="12345678"
                  className={
                    errors.idNumber ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.idNumber && (
                  <p className="text-sm text-red-500">
                    {errors.idNumber.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="kraPin">
                  <Pin className="w-4 h-4 inline mr-1" />
                  KRA PIN <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="kraPin"
                  {...register("kraPin")}
                  placeholder="A1234567890B"
                  className={
                    errors.kraPin ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.kraPin && (
                  <p className="text-sm text-red-500">
                    {errors.kraPin.message}
                  </p>
                )}
              </Field>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#1e3a5f] uppercase tracking-wider">
              Security
            </h3>
            <Field>
              <FieldLabel htmlFor="password">
                <Lock className="w-4 h-4 inline mr-1" />
                Password <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create a strong password"
                  className={
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Strength:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`h-1.5 flex-1 rounded-full ${
                            star <= passwordStrength.score
                              ? passwordStrength.color.replace("text-", "bg-")
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <FieldDescription>
                    Must be at least 8 characters with letters, numbers, and
                    symbols
                  </FieldDescription>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm Password <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter your password"
                  className={
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-3 text-sm text-[#1e3a5f] cursor-pointer">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary cursor-pointer rounded border-gray-300 focus:ring-primary"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              </div>
              <div className="leading-tight">
                I have read and agreed to the{" "}
                <Link
                  href="/terms"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="w-full text-white bg-gradient-to-r from-[#1e3a5f] to-[#397397] hover:from-[#162d47] hover:to-[#2e5e74] shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="text-primary font-semibold hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default StandaloneSignupForm;
