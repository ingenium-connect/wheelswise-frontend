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
import { PersonalDetails as PersonalDetailsType } from "@/types/data";
import { validateEmail } from "@/utilities/validation-schemas";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const PersonalDetails = ({ motor_type, product_type }: Props) => {
  const { personalDetails, setPersonalDetails } = usePersonalDetailsStore();
  const router = useRouter();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);
  const isCoOwned = useInsuranceStore((state) => state.isCoOwned);

  const [form, setForm] = useState({
    firstName: personalDetails.user.firstName || "",
    lastName: personalDetails.user.lastName || "",
    phoneNumber: personalDetails.user.phoneNumber || "",
    email: "",
    idNumber: personalDetails.user.idNumber || "",
    kraPin: personalDetails.user.kraPin || "",
  });

  const [secondaryForm, setSecondaryForm] = useState({
    firstName: personalDetails.secondary_user?.firstName || "",
    lastName: personalDetails.secondary_user?.lastName || "",
    phoneNumber: personalDetails.secondary_user?.phoneNumber || "",
    email: personalDetails.secondary_user?.email || "",
    idNumber: personalDetails.secondary_user?.idNumber || "",
    kraPin: personalDetails.secondary_user?.kraPin || "",
  });

  useEffect(() => {
    setCoverStep(5);
  }, [setCoverStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setting same email on both forms for validation errros remove this later on
    if (e.target.name === "email") {
      setForm({ ...form, email: e.target.value });
    }

    setSecondaryForm({ ...secondaryForm, [e.target.name]: e.target.value });
  };

  /**
   * checks for required fields
   */
  const checkRequiredFields = (): boolean => {
    if (isCoOwned && personalDetails.secondary_user) {
      return validateEmail(secondaryForm.email);
    } else {
      return validateEmail(form.email);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails({ ...form });
    setPersonalDetails({ ...secondaryForm }, "secondary_user");

    if (!checkRequiredFields())
      return toast.error("Please fill in the required details");
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
                Proposer (Hirer)
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
                isCoOwned={true}
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
                handleChange={handleSecondaryChange}
                isCoOwned={true}
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
              isCoOwned={false}
              isOwnerForm={true}
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
  isCoOwned,
  isOwnerForm,
}: {
  form: PersonalDetailsType;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
              readOnly={isOwnerForm}
              disabled={isOwnerForm}
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
              readOnly={isOwnerForm}
              disabled={isOwnerForm}
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
              placeholder="eg. 0712345678"
              disabled={isOwnerForm && isCoOwned}
              readOnly={isOwnerForm && isCoOwned}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="emailAddress">
              Email Address<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="emailAddress"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              disabled={isCoOwned && isOwnerForm}
              readOnly={isCoOwned && isOwnerForm}
              required={isOwnerForm}
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
              readOnly={isOwnerForm}
              disabled={isOwnerForm}
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
              readOnly={isOwnerForm}
              disabled={isOwnerForm}
              required
            />
          </Field>
        </div>
      </div>
    </form>
  );
};

export default PersonalDetails;
