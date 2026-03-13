"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HeadphonesIcon, Loader2 } from "lucide-react";
import { axiosClient } from "@/utilities/axios-client";
import { SUPPORT_REQUEST_ENDPOINT } from "@/utilities/endpoints";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "Policy Inquiry", value: "POLICY_INQUIRY" },
  { label: "Claim Assistance", value: "CLAIM_ASSISTANCE" },
  { label: "Payment Issue", value: "PAYMENT_ISSUE" },
  { label: "Account Access", value: "ACCOUNT_ACCESS" },
  { label: "Vehicle Registration", value: "VEHICLE_REGISTRATION" },
  { label: "Technical Support", value: "TECHNICAL_SUPPORT" },
  { label: "Other", value: "OTHER" },
];

export default function SupportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post(SUPPORT_REQUEST_ENDPOINT, form);
      toast.success("Support request submitted. We'll be in touch shortly.");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#d7e8ee] rounded-lg px-3 py-2.5 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white placeholder:text-muted-foreground";

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
              <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-[#1e3a5f] text-sm">
                  Contact Support
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the form below and we will get back to you within 24
                  hours.
                </p>
              </div>
            </div>

            {/* Personal info */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Your Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className="border-[#d7e8ee]"
                />
              </div>
            </div>

            {/* Request details */}
            <div className="border-t border-[#d7e8ee] pt-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Request Details
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your issue"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your issue in detail..."
                    required
                    rows={5}
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
