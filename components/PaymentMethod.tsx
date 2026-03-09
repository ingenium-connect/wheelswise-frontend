"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/utilities/axios-client";
import {
  POLICY_PAYMENT_ENDPOINT,
  POLICY_PAYMENT_VERIFY_ENDPOINT,
} from "@/utilities/endpoints";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { isAxiosError } from "axios";
import Image from "next/image";

type Props = {
  token?: string | undefined;
};

const methods = [
  {
    id: "mpesa",
    label: "M-Pesa",
    description: "Pay instantly using your mobile wallet.",
    image: "/mpesa.png",
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "card",
    label: "Card",
    description: "Secure payment via debit or credit card.",
    image: "/card.png",
    icon: <CreditCard className="w-4 h-4" />,
  },
];

const PaymentMethod = ({ token }: Props) => {
  const [selectedMethod, setSelectedMethod] = useState("mpesa");
  const phoneNumber = usePersonalDetailsStore(
    (s) => s.personalDetails.phoneNumber,
  );
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const vehicleNumber = useVehicleStore((v) => v.vehicleDetails.vehicleNumber);
  const cover = useInsuranceStore((s) => s.cover);
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const selectedAdditionalBenefitIds = useInsuranceStore(
    (s) => s.selectedAdditionalBenefitIds,
  );
  const router = useRouter();
  const [localPhone, setLocalPhone] = useState(phoneNumber);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    payment_reference: string;
    premium: number;
    user: { msisdn: string };
  } | null>(null);

  const amount = useMemo(() => {
    return (
      motorSubType?.underwriter_product?.premium_amount?.one_time_payment ??
      motorSubType?.product_rate?.least_premium_amount ??
      0
    );
  }, [motorSubType]);

  const handleChoose = useCallback((method: string) => {
    setSelectedMethod(method);
  }, []);
  const handleCardDetailsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    if (selectedMethod !== "mpesa") return;
    setError("");
    setIsLoading(true);
    try {
      const paymentMethodId = localStorage.getItem("payment_method_id");
      const policyStartDate = localStorage.getItem("policy_start_date");
      const isComprehensive = cover === "COMPREHENSIVE";

      const payload: Record<string, unknown> = {
        amount,
        vehicle_registration_number: vehicleNumber,
        product_id: motorSubType?.underwriter_product.id,
        underwriter_id: motorSubType?.underwriter_product.underwriter_id,
        start_date: policyStartDate,
        cover_type: cover,
        payment_method_id: paymentMethodId,
        additional_benefits: selectedAdditionalBenefitIds,
      };

      if (isComprehensive) {
        payload.product_rate_id = motorSubType?.product_rate?.id;
      } else {
        payload.tpo_price_list_id = motorSubType?.tpo_price_list?.id;
      }
      const res = await axiosClient.post(POLICY_PAYMENT_ENDPOINT, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmationData(res.data);
      toast.success("STK push sent. Check your phone to confirm payment.");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to initiate payment.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmationData?.payment_reference) return;
    setError("");
    setIsLoading(true);
    try {
      await axiosClient.post(
        POLICY_PAYMENT_VERIFY_ENDPOINT,
        {
          msisdn: confirmationData.user.msisdn,
          payment_reference: confirmationData.payment_reference,
          amount: confirmationData.premium,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Payment confirmed!");
      router.push("/vehicle-policy/payment-success");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Payment verification failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#d7e8ee] rounded-lg px-3 py-2.5 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white placeholder:text-muted-foreground";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Method selector */}
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Choose Payment Method
          </p>
          <div className="grid grid-cols-2 gap-4" role="radiogroup">
            {methods.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`relative rounded-xl border-2 p-5 text-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-[#d7e8ee] bg-white hover:border-primary/40"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <Image
                    src={method.image}
                    alt={method.label}
                    width={120}
                    height={48}
                    className="mx-auto mb-3 h-10 object-contain"
                  />
                  <p
                    className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-[#1e3a5f]"}`}
                  >
                    {method.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#d7e8ee]" />

        {/* M-Pesa form */}
        {selectedMethod === "mpesa" && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                M-Pesa Details
              </p>
              <Card className="border border-[#d7e8ee] shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#d7e8ee]">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1e3a5f]">
                        M-Pesa STK Push
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You will receive a prompt on your phone to confirm
                        payment.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      placeholder="07XXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePay}
                disabled={isLoading}
                className="flex-1 text-white hover:cursor-pointer"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Payment Request
              </Button>
              <Button
                variant="outline"
                onClick={handleConfirmPayment}
                disabled={!confirmationData?.payment_reference || isLoading}
                className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Payment
              </Button>
            </div>
          </div>
        )}

        {/* Card form */}
        {selectedMethod === "card" && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                Card Details
              </p>
              <Card className="border border-amber-200 shadow-sm bg-amber-50">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-700 font-medium">
                    Card payments are coming soon. Please use M-Pesa for now.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="opacity-50 pointer-events-none space-y-4">
              <Card className="border border-[#d7e8ee] shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#d7e8ee]">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1e3a5f]">
                        Debit / Credit Card
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Visa, Mastercard accepted.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      name="cardNumber"
                      onChange={handleCardDetailsChange}
                      disabled
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        name="expiry"
                        onChange={handleCardDetailsChange}
                        disabled
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1e3a5f] mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        name="cvv"
                        onChange={handleCardDetailsChange}
                        disabled
                        className={inputClass}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button disabled className="w-full text-white cursor-not-allowed">
                Pay
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
