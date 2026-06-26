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
  LucideFileSignature,
  LucideSettings,
  LucideCog,
  LucideCar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

import {
  FinalUserPayload,
  FinalVehiclePayload,
  vehicleSearchResponseType,
} from "@/types/data";
import axios, { isAxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import VehicleSearch from "@/components/vehicle/vehicleSearch";

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
    msisdn: z
      .string()
      .min(10, "Valid phone number is required")
      .regex(
        /^(254|\+254|0)[0-9]{9,10}$/,
        "Please enter a valid phone number (e.g., 0712 345 678 or 254712345678)",
      ),
    email: z
      .string()
      .email("Valid email is required")
      .min(1, "Email is required"),

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
  const [searchDetails, setSearchDetails] = useState<vehicleSearchResponseType>(
    {
      vehicleFound: false,
    },
  );
  const [showVehiclePreview, setShowVehiclePreview] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      msisdn: "",
      email: "",
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
      const userPayload = {
        msisdn: data.msisdn.trim(),
        email: data.email.trim(),
        password: data.password,
        confirm_password: data.confirmPassword,
        user_type: "CUSTOMER",
      };

      // extracting user data from the search results
      if (
        !searchDetails.regNo ||
        !searchDetails.vehicleDetails ||
        !searchDetails.motorType
      ) {
        return toast.error(
          "Some vehicle details are missing. Please go back and search again.",
        );
      }
      if (
        !searchDetails.personalDetails ||
        searchDetails.personalDetails.length < 1
      ) {
        return toast.error(
          "Personal details missing. Please go back and search for the vehicle to fetch your details.",
        );
      }

      const { ID_NUMBER, FIRSTNAME, LASTNAME, PIN } =
        searchDetails.personalDetails[0];

      const finalUserPayload: FinalUserPayload = {
        source: "NTSA",
        source_vehicle_reg_number: searchDetails.regNo,
        user: {
          ...userPayload,
          id_number: ID_NUMBER,
          first_name: FIRSTNAME,
          ...(LASTNAME && { last_name: LASTNAME }),
          kra_pin: PIN,
        },
      };

      // Build the vehicle payload from the NTSA search result so the vehicle
      // is registered (source: NTSA) after OTP verification.
      const vehicle = searchDetails.vehicleDetails;
      const finalVehiclePayload: FinalVehiclePayload = {
        source: "NTSA",
        vehicle: {
          registration_number: searchDetails.regNo,
          make: vehicle.carMake,
          model: vehicle.carModel,
          chassis_number: vehicle.ChassisNo,
          engine_capacity: vehicle.engineCapacity,
          engine_number: vehicle.engineNumber || undefined,
          body_type: vehicle.bodyType,
          seating_capacity: vehicle.passengerCapacity,
          vehicle_value: searchDetails?.vehicleValue,
          vehicle_type: searchDetails.motorType,
          year_of_manufacture: Number(vehicle.yearOfManufacture),
          purpose: vehicle.purpose || undefined,
          purpose_type: searchDetails?.purposeCategory,
        },
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
          // Stage the NTSA vehicle for registration after OTP, and mark this as
          // a standalone signup so OTP routing lands on the dashboard (no plan
          // selected) instead of the payment summary.
          sessionStorage.setItem(
            "__pending_vehicle_payload__",
            JSON.stringify(finalVehiclePayload),
          );
          sessionStorage.setItem("__standalone_signup__", "true");
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
    <>
      {!searchDetails.vehicleFound ? (
        <VehicleSearch
          onSearchSuccess={(res) => {
            setSearchDetails(res);
            setShowVehiclePreview(true);
          }}
        />
      ) : (
        <>
          {showVehiclePreview ? (
            <Card className="border p-4 shadow-lg overflow-hidden">
              <div className="text-center mb-8">
                <div className="flex flex-col items-center">
                  <p className="font-bold text-3xl text-[#1e3a5f] tracking-wider">
                    {searchDetails.regNo}
                  </p>
                  <p className="text-muted-foreground mt-2 text-lg">
                    {searchDetails.vehicleDetails?.carMake}{" "}
                    {searchDetails.vehicleDetails?.carModel} (
                    {searchDetails.vehicleDetails?.yearOfManufacture})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
                  <LucideCar className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-medium text-[#1e3a5f]">
                    {searchDetails.vehicleDetails?.bodyType}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Body
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
                  <LucideCog className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-medium text-[#1e3a5f]">
                    {searchDetails.vehicleDetails?.engineCapacity} CC
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Engine
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
                  <LucideFileSignature className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-medium text-[#1e3a5f] truncate max-w-[80px]">
                    {searchDetails.vehicleDetails?.ChassisNo}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Chassis
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
                  <LucideSettings className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-medium text-[#1e3a5f] truncate max-w-[80px]">
                    {searchDetails.vehicleDetails?.engineNumber}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Engine #
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowVehiclePreview(false)}>Next</Button>
            </Card>
          ) : (
            // TODO: add preview for personal details section
            <Card
              className="border border-[#d7e8ee] shadow-lg overflow-hidden"
              {...props}
            >
              {/* add section to show the  */}

              <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
              <CardContent className="p-8">
                <form
                  onSubmit={handleSubmit(handleSignup)}
                  className="space-y-6"
                >
                  {signupError && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{signupError}</span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-[#1e3a5f] uppercase tracking-wider mb-4">
                      Registered owner
                    </h3>
                    <div className="flex gap-4 bg-primary/20 p-4 rounded-md">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      {searchDetails.personalDetails && (
                        <div>
                          <div className="flex gap-4 font-bold text-lg">
                            <p>{searchDetails.personalDetails[0].FIRSTNAME}</p>
                            <p>{searchDetails.personalDetails[0].LASTNAME}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2">
                            <p className="text-sm">ID Number:</p>
                            <p>
                              <IdCard className="w-4 h-4 inline mr-1 text-primary" />
                              {searchDetails.personalDetails[0].ID_NUMBER}
                            </p>
                            <p className="text-sm">KRA PIN:</p>
                            <p>
                              <Pin className="w-4 h-4 inline mr-1 text-primary" />
                              {searchDetails.personalDetails[0].PIN}
                            </p>
                          </div>
                        </div>
                      )}
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
                            errors.msisdn
                              ? "border-red-500 focus:border-red-500"
                              : ""
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
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
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
                            errors.password
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
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
                                      ? passwordStrength.color.replace(
                                          "text-",
                                          "bg-",
                                        )
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
                            Must be at least 8 characters with letters, numbers,
                            and symbols
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
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
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
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
          )}
        </>
      )}
    </>
  );
};

export default StandaloneSignupForm;
