"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/utilities/axios-client";
import { POLICY_COMPLETE_PURCHASE_ENDPOINT } from "@/utilities/endpoints";

type Props = {
  policyId: string;
  token: string;
};

export function CompletePaymentButton({ policyId, token }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      await axiosClient.post(
        `${POLICY_COMPLETE_PURCHASE_ENDPOINT}/${policyId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Payment completed successfully.");
    } catch {
      toast.error("Failed to complete payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleComplete} disabled={loading} className="text-white">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Complete Payment
    </Button>
  );
}
