"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useInsuranceStore } from "@/store/store";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const PersonalDetails = ({ motor_type, product_type }: Props) => {
  const { personalDetails, setPersonalDetails } = usePersonalDetailsStore();
  const router = useRouter();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  const isNtsaRegistered = personalDetails.ntsaRegitered || false;

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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails({ ...form });

    setTimeout(() => {
      toast.success("User details saved.", { duration: 2000 });
      reset();
      router.push(
        `/signup?product_type=${product_type}&motor_type=${motor_type}`
      );
    }, 200);
  };

  const reset = () => {
    setForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      idNumber: "",
      kraPin: "",
    });
  };

  const cancelAction = () => {
    reset();
    router.push(
      `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`
    );
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Personal Details</FieldLegend>
                <FieldDescription>
                  Please provide your personal details.
                </FieldDescription>
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        id="firstName"
                        type="text"
                        name="firstName"
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
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        readOnly={isNtsaRegistered}
                        disabled={isNtsaRegistered}
                        required
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="phoneNumber">
                        Phone Number
                      </FieldLabel>
                      <Input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="254*********"
                        readOnly={isNtsaRegistered}
                        disabled={isNtsaRegistered}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emailAddress">
                        Email Address
                      </FieldLabel>
                      <Input
                        id="emailAddress"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="kraPin">KRA PIN</FieldLabel>
                      <Input
                        id="kraPin"
                        type="text"
                        name="kraPin"
                        value={form.kraPin}
                        onChange={handleChange}
                        placeholder="KRA PIN"
                        readOnly={isNtsaRegistered}
                        disabled={isNtsaRegistered}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="idNumber">ID Number</FieldLabel>
                      <Input
                        id="idNumber"
                        type="text"
                        name="idNumber"
                        value={form.idNumber}
                        onChange={handleChange}
                        placeholder="ID Number"
                        readOnly={isNtsaRegistered}
                        disabled={isNtsaRegistered}
                        required
                      />
                    </Field>
                  </div>

                  <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={cancelAction}
                    >
                      Cancel
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDetails;
