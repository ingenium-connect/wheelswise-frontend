"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { User } from "lucide-react";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const PersonalDetails = ({ motor_type, product_type }: Props) => {
  const { personalDetails, setPersonalDetails } = usePersonalDetailsStore();
  const router = useRouter();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  const isNtsaRegistered = personalDetails.ntsaRegistered || false;

  const [form, setForm] = useState({
    firstName: personalDetails.firstName || "",
    lastName: personalDetails.lastName || "",
    phoneNumber: personalDetails.phoneNumber || "",
    email: "",
    idNumber: personalDetails.idNumber || "",
    kraPin: personalDetails.kraPin || "",
  });

  useEffect(() => {
    setCoverStep(5);
  }, [setCoverStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails({ ...form });
    toast.success("User details saved.", { duration: 2000 });
    setTimeout(() => {
      router.push(
        `/signup?product_type=${product_type}&motor_type=${motor_type}`,
      );
    }, 200);
  };

  const cancelAction = () => {
    router.back();
  };

  return (
    <Card className="w-full border border-[#d7e8ee] shadow-sm overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
            <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f] text-sm">
                Personal Details
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Please provide your personal information.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Full Name
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  readOnly={isNtsaRegistered}
                  disabled={isNtsaRegistered}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  readOnly={isNtsaRegistered}
                  disabled={isNtsaRegistered}
                  required
                />
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-[#d7e8ee] pt-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Contact
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="254*********"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emailAddress">Email Address</FieldLabel>
                <Input
                  id="emailAddress"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </Field>
            </div>
          </div>

          {/* Identity */}
          <div className="border-t border-[#d7e8ee] pt-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Identity
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="idNumber">ID Number</FieldLabel>
                <Input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={form.idNumber}
                  onChange={handleChange}
                  placeholder="ID Number"
                  readOnly={isNtsaRegistered}
                  disabled={isNtsaRegistered}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="kraPin">KRA PIN</FieldLabel>
                <Input
                  id="kraPin"
                  name="kraPin"
                  type="text"
                  value={form.kraPin}
                  onChange={handleChange}
                  placeholder="KRA PIN"
                  readOnly={isNtsaRegistered}
                  disabled={isNtsaRegistered}
                  required
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
              onClick={cancelAction}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 text-white">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
