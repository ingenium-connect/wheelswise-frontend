"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const PersonalDetails = ({ motor_type, product_type }: Props) => {
  const { personalDetails, setPersonalDetails } = usePersonalDetailsStore();
  const router = useRouter();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);
  const isCoOwned = useInsuranceStore((state) => state.isCoOwned);

  const isNtsaRegistered = personalDetails.user.ntsaRegistered || false;

  const [form, setForm] = useState({
    firstName: personalDetails.user.firstName || "",
    lastName: personalDetails.user.lastName || "",
    phoneNumber: personalDetails.user.phoneNumber || "",
    email: "",
    idNumber: personalDetails.user.idNumber || "",
    kraPin: personalDetails.user.kraPin || "",
  });

  const [secondaryForm, setSecondaryForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    kraPin: "",
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
        {isCoOwned ? (
          <Tabs defaultValue="proposer">
            <TabsList>
              <TabsTrigger value="owner">Owner</TabsTrigger>
              <TabsTrigger value="proposer" disabled={isCoOwned ? false : true}>
                Proposer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="owner">
              {/* Header */}

              <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">
                    Owner Details
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Details of the car owner.
                  </p>
                </div>
              </div>

              <PersonalDetailsForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isCoOwned={isCoOwned ? true : false}
                isOwnerForm={true}
              />
            </TabsContent>
            <TabsContent value="proposer">
              <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">
                    Policy holder details
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Details of the policy holder.
                  </p>
                </div>
              </div>

              <PersonalDetailsForm
                form={secondaryForm}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isCoOwned={isCoOwned ? true : false}
                isOwnerForm={false}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
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
            <PersonalDetailsForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isCoOwned={isCoOwned ? true : false}
            />
          </>
        )}
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
          <Button onClick={handleSubmit} className="flex-1 text-white">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PersonalDetailsForm = ({
  form,
  handleChange,
  handleSubmit,
  isCoOwned,
  isOwnerForm,
}: {
  form: any;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: ChangeEvent<HTMLFormElement>) => void;
  isCoOwned: boolean;
  isOwnerForm?: boolean;
}) => {
  return (
    <form className="space-y-6">
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
              value={!isCoOwned || isOwnerForm ? form.firstName : undefined}
              onChange={handleChange}
              placeholder="First Name"
              readOnly={isCoOwned || isOwnerForm ? false : true}
              disabled={isCoOwned || isOwnerForm ? false : true}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={!isCoOwned || isOwnerForm ? form.lastName : undefined}
              onChange={handleChange}
              placeholder="Last Name"
              readOnly={isCoOwned || !isOwnerForm ? false : true}
              disabled={isCoOwned || !isOwnerForm ? false : true}
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
              value={!isCoOwned || isOwnerForm ? form.phoneNumber : undefined}
              onChange={handleChange}
              placeholder="254*********"
              disabled={isOwnerForm ? true : false}
              readOnly={isOwnerForm ? true : false}
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
              disabled={isOwnerForm ? true : false}
              readOnly={isOwnerForm ? true : false}
              required={isOwnerForm ? true : false}
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
              value={!isCoOwned || isOwnerForm ? form.idNumber : undefined}
              onChange={handleChange}
              placeholder="ID Number"
              readOnly={isCoOwned || isOwnerForm ? false : true}
              disabled={isCoOwned || isOwnerForm ? false : true}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="kraPin">KRA PIN</FieldLabel>
            <Input
              id="kraPin"
              name="kraPin"
              type="text"
              value={!isCoOwned || isOwnerForm ? form.kraPin : undefined}
              onChange={handleChange}
              placeholder="KRA PIN"
              readOnly={isCoOwned || isOwnerForm ? false : true}
              disabled={isCoOwned || isOwnerForm ? false : true}
              required
            />
          </Field>
        </div>
      </div>
    </form>
  );
};

export default PersonalDetails;
