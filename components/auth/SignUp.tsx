"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useUserStore } from "@/stores/userStore";
import {
  FinalUserPayload,
  FinalVehiclePayload,
  vehiclePayload,
} from "@/types/data";
import axios, { isAxiosError } from "axios";

interface SignupForm {
  msisdn: string;
  password: string;
  confirm_password: string;
}

interface Props extends React.ComponentProps<typeof Card> {
  motor_type: string | undefined;
  product_type: string | undefined;
}

const Signup: React.FC<Props> = ({
  motor_type,
  product_type,
  ...props
}: Props) => {
  const { personalDetails } = usePersonalDetailsStore();

  const { tonnage, seating_capacity, vehicleDetails } = useVehicleStore();

  const selectedMotorType = useInsuranceStore((store) => store.motorType);
  const cover = useInsuranceStore((store) => store.cover);
  const { setProfile } = useUserStore();

  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>({
    msisdn: personalDetails.phoneNumber,
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requiredFields = <T extends object>(obj: T, fields: (keyof T)[]) => {
    return fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
  };

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
    // Strip generic prefix added by postHandler
    const msg = raw.replace(/^Failed to fetch data:\s*/i, "").trim();
    const lower = msg.toLowerCase();
    if (lower.includes("already exists") || lower.includes("already registered") || lower.includes("duplicate"))
      return "An account with these details already exists. Please log in instead.";
    if (lower.includes("phone") && (lower.includes("invalid") || lower.includes("format")))
      return "The phone number format is invalid. Please use the format +254XXXXXXXXX.";
    if (lower.includes("national_id") || lower.includes("id number") || lower.includes("identifier"))
      return "The ID number provided is invalid or already in use.";
    if (lower.includes("password") && lower.includes("short"))
      return "Password must be at least 8 characters.";
    if (lower.includes("token missing") || lower.includes("token"))
      return "Registration failed. Please check your details and try again.";
    if (lower.includes("network") || lower.includes("fetch"))
      return "Network error. Please check your connection and try again.";
    // Return the cleaned message if it's reasonably short and human-readable
    if (msg.length < 120 && !msg.includes("status code")) return msg;
    return "Registration failed. Please check your details and try again.";
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    try {
      // -------------------------------------
      // 1. Basic form validation
      // -------------------------------------
      if (!formData.password || formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      if (formData.password !== formData.confirm_password) {
        throw new Error("Passwords do not match.");
      }

      if (!selectedMotorType?.name) {
        throw new Error("Please select a valid motor type.");
      }

      // -------------------------------------
      // 2. Validate personal details
      // -------------------------------------
      const missingPersonalFields = requiredFields(personalDetails, [
        "firstName",
        "lastName",
        "phoneNumber",
        "email",
        "idNumber",
        "kraPin",
      ]);

      if (missingPersonalFields.length > 0) {
        throw new Error(
          `Missing personal details: ${missingPersonalFields.join(", ")}`,
        );
      }

      // -------------------------------------
      // 3. Validate vehicle details
      // -------------------------------------
      const missingVehicleFields = requiredFields(vehicleDetails, [
        "vehicleValue",
        "vehicleNumber",
        "make",
        "model",
        "chassisNumber",
        "year",
      ]);

      if (missingVehicleFields.length > 0) {
        throw new Error(
          `Missing vehicle details: ${missingVehicleFields.join(", ")}`,
        );
      }

      setIsLoading(true);

      // -------------------------------------
      // 4. Build user payload
      // -------------------------------------
      const userDetailsPayload = {
        first_name: personalDetails.firstName.trim(),
        last_name: personalDetails.lastName.trim(),
        msisdn: formData.msisdn.trim(),
        id_number: personalDetails.idNumber.trim(),
        email: personalDetails.email.trim(),
        kra_pin: personalDetails.kraPin.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        user_type: "CUSTOMER",
      };

      // -------------------------------------
      // 5. Build vehicle payload with sanitization
      // -------------------------------------
      const vehiclePayload: vehiclePayload = {
        chassis_number: vehicleDetails.chassisNumber.trim(),
        registration_number: vehicleDetails.vehicleNumber.trim(),
        make: vehicleDetails.make.trim(),
        model: vehicleDetails.model.trim(),
        engine_capacity: vehicleDetails.engineCapacity
          ? Number(vehicleDetails.engineCapacity)
          : null,
        engine_number: vehicleDetails.engineNumber?.trim() || undefined,
        body_type: vehicleDetails.bodyType.trim(),
        vehicle_value: Number.isFinite(+vehicleDetails.vehicleValue)
          ? +vehicleDetails.vehicleValue
          : null,
        seating_capacity: seating_capacity ? Number(seating_capacity) : null,
        vehicle_type: selectedMotorType.name,
        year_of_manufacture: Number(vehicleDetails.year),
        purpose: vehicleDetails.vehiclePurpose?.trim() || undefined,
        purpose_type: vehicleDetails.vehiclePurposeCategory
          ? Number(vehicleDetails.vehiclePurposeCategory)
          : null,
      };

      if (selectedMotorType.name === "COMMERCIAL") {
        vehiclePayload.tonnage = tonnage;
      }

      const finalUserPayload: FinalUserPayload = {
        source: personalDetails.ntsaRegistered ? "NTSA" : "",
        source_vehicle_reg_number: personalDetails.ntsaRegistered
          ? vehicleDetails.vehicleNumber.trim()
          : "",
        user: userDetailsPayload,
      };

      const finalVehiclePayload: FinalVehiclePayload = {
        source: vehicleDetails.ntsaRegistered ? "NTSA" : "",
        intended_policy_type: cover === "COMPREHENSIVE" ? "COMPREHENSIVE" : "THIRD_PARTY",
        vehicle: vehiclePayload,
      };
      // -------------------------------------
      // 6. Server action — capture result to persist user_id
      // -------------------------------------
      const res = await signupAction({
        userPayload: finalUserPayload,
        vehiclePayload: finalVehiclePayload,
      });

      if (res?.user?.id) {
        setProfile({ id: res.user.id } as Parameters<typeof setProfile>[0]);
      }

      toast.success("Successfully registered!");
      router.push(
        `/otp-verify?product_type=${product_type}&motor_type=${motor_type}`,
      );
      router.refresh();
    } catch (error) {
      setSignupError(extractSignupError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signupAction = async ({
    userPayload,
    vehiclePayload,
  }: {
    userPayload: FinalUserPayload;
    vehiclePayload: FinalVehiclePayload;
  }) => {
    const res = await axios.post("/api/signup", {
      userPayload,
      vehiclePayload,
    });

    return res.data;
  };
  return (
    <>
      {personalDetails.phoneNumber ? (
        <Card
          className="border border-[#d7e8ee] shadow-sm overflow-hidden"
          {...props}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
          <CardContent className="p-6">
            <form onSubmit={handleSignup} className="space-y-5">
              {signupError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="msisdn">Phone Number</FieldLabel>
                <Input
                  id="msisdn"
                  type="tel"
                  readOnly
                  name="msisdn"
                  value={formData.msisdn}
                  onChange={handleChange}
                  placeholder="+254712***678"
                  required
                  className="bg-[#f0f6f9]"
                />
                <FieldDescription className="text-xs text-muted-foreground mt-1">
                  This is the number linked to your account.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm_password">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </div>
              </Field>

              <label className="flex items-start gap-2 text-sm text-[#1e3a5f] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-primary cursor-pointer"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span>
                  I have read and agreed to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary font-medium hover:underline"
                    target="_blank"
                  >
                    Privacy Policy, Disclaimer &amp; Cookies Policy
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline"
                  href="/login"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {toast.error("Personal details not found please fill them.") &&
            redirect("/#cover-types")}
        </>
      )}
    </>
  );
};

export default Signup;
