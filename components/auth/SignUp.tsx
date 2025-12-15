"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { handleRegisterVehicle, postHandler } from "@/utilities/api";
import {
  REGISTER_VEHICLE_ENDPOINT,
  USER_REGISTRATION_ENDPOINT,
} from "@/utilities/endpoints";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { useVehicleDetailsStore } from "@/stores/vehicleDetailsStore";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useInsuranceStore } from "@/store/store";

interface SignupForm {
  msisdn: string;
  password: string;
  confirm_password: string;
}

const Signup: React.FC = ({ ...props }: React.ComponentProps<typeof Card>) => {
  const { personalDetails } = usePersonalDetailsStore();

  const { vehicleDetails } = useVehicleDetailsStore();
  const { tonnage, seating_capacity } = useVehicleStore();

  const selectedMotorType = useInsuranceStore((store) => store.motorType);

  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>({
    msisdn: personalDetails.phoneNumber,
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requiredFields = <T extends object>(obj: T, fields: (keyof T)[]) => {
    return fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear inline errors
    setIsLoading(true);

    try {
      // -------------------------------------
      // 1. Basic form validation
      // -------------------------------------
      if (!formData.password || formData.password.length < 8) {
        return toast.error("Password too short", {
          description: "Your password must be at least 8 characters.",
        });
      }

      if (formData.password !== formData.confirm_password) {
        return toast.error("Passwords do not match");
      }

      if (!selectedMotorType?.name) {
        return toast.error("Missing Vehicle Type", {
          description: "Please select a valid motor type before continuing.",
        });
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
        return toast.error("Missing personal details", {
          description: missingPersonalFields.join(", "),
        });
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
        return toast.error("Missing vehicle details", {
          description: missingVehicleFields.join(", "),
        });
      }

      // -------------------------------------
      // 4. Build user payload safely
      // -------------------------------------
      const userDetailsPayload = {
        msisdn: formData.msisdn.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        name: `${personalDetails.firstName} ${personalDetails.lastName}`.trim(),
        id_number: personalDetails.idNumber.trim(),
        email: personalDetails.email.trim(),
        kra_pin: personalDetails.kraPin.trim(),
        user_type: "COMPREHENSIVE_CUSTOMER",
      };

      // -------------------------------------
      // 5. Build vehicle payload with sanitization
      // -------------------------------------
      const baseVehiclePayload = {
        vehicle_value: Number(vehicleDetails.vehicleValue) || null,
        registration_number: vehicleDetails.vehicleNumber.trim(),
        model: vehicleDetails.model.trim(),
        chasis_number: vehicleDetails.chassisNumber.trim(),
        make: vehicleDetails.make.trim(),
        engine_capacity: vehicleDetails.engineCapacity
          ? Number(vehicleDetails.engineCapacity)
          : null,
        vehicle_type: selectedMotorType.name,
        year_of_manufacture: String(vehicleDetails.year).trim(),
      };

      const vehiclePayload =
        selectedMotorType.name === "PSV"
          ? { ...baseVehiclePayload, seating_capacity }
          : selectedMotorType.name === "COMMERCIAL"
          ? { ...baseVehiclePayload, tonnage }
          : baseVehiclePayload;

      // -------------------------------------
      // 6. Register user
      // -------------------------------------
      const userResponse = await postHandler(
        USER_REGISTRATION_ENDPOINT,
        false,
        userDetailsPayload
      );

      if (!userResponse?.auth_credentials?.token) {
        return toast.error("Registration Error", {
          description: "Could not retrieve authentication token.",
        });
      }

      const token = userResponse.auth_credentials.token;

      // -------------------------------------
      // 7. Register vehicle
      // -------------------------------------
      const vehicleRegResponse = await handleRegisterVehicle(
        REGISTER_VEHICLE_ENDPOINT,
        token,
        vehiclePayload
      );

      if (!vehicleRegResponse) {
        return toast.error("Vehicle registration failed", {
          description: "Please check your details and try again.",
        });
      }

      // -------------------------------------
      // 8. Success
      // -------------------------------------
      toast.success("Successfully registered!");
      router.push("/otp-verify");
    } catch (error) {
      console.log(error, "error");
      let errorMessage = "An unexpected error occurred."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error("Registration Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <FieldGroup>
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
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  required
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm_password">
                Confirm Password
              </FieldLabel>
              <div>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  type={showConfirm ? "text" : "password"}
                  placeholder="*******"
                  required
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link
                    className="text-primary font-medium cursor-pointer hover:underline"
                    href="/login"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
