"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { axiosClient } from "@/utilities/axios-client";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { PaymentMethods, UIMappedPaymentMethod } from "@/types/data";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  Shield,
} from "lucide-react";

const PaymentSummary = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<UIMappedPaymentMethod[]>(
    [],
  );
  const [oneTimePayment, setOneTimePayment] = useState<number>(0);
  const [date, setDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const today = new Date();

  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const cover = useInsuranceStore((s) => s.cover);
  const { vehicleDetails } = useVehicleStore();

  const MappedPaymentMethods: Record<
    string,
    { name: string; description: string; key: string }
  > = {
    ONE_TIME: {
      name: "One Time",
      description: "Pay the full amount in one go for hassle-free coverage.",
      key: "onetime",
    },
    INSTALLMENT: {
      name: "Installment",
      description: "Pay the full amount in 2 installments.",
      key: "installment",
    },
  };

  useEffect(() => {
    if (motorSubType?.underwriter_product.premium_amount?.one_time_payment) {
      setSelectedPaymentMethod("onetime");
      setOneTimePayment(
        motorSubType.underwriter_product.premium_amount.one_time_payment,
      );
    } else {
      setSelectedPaymentMethod("installment");
    }
  }, [motorSubType]);

  const methodMapper = useCallback(
    (payment_methods: PaymentMethods[]) => {
      const enrichedPaymentMethods: UIMappedPaymentMethod[] = payment_methods
        .map((method: UIMappedPaymentMethod) => {
          const mapped = MappedPaymentMethods[method.name];
          if (!mapped) return null;
          return {
            ...method,
            name: mapped.name,
            description: mapped.description,
            uiKey: mapped.key,
          };
        })
        .filter(Boolean) as UIMappedPaymentMethod[];
      return enrichedPaymentMethods;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const underwriterId = motorSubType?.underwriter_product.underwriter_id;
    if (!underwriterId) return;
    axiosClient
      .get(`payment-method?underwriter_id=${underwriterId}`)
      .then((res) => {
        const mappedMethods = methodMapper(res.data?.payment_method);
        setPaymentMethods(mappedMethods ?? []);
        if (mappedMethods.length > 0) {
          setSelectedPaymentMethod(mappedMethods[0].uiKey);
        }
      })
      .catch(console.error);
  }, [motorSubType, methodMapper]);

  const productName =
    motorSubType?.underwriter_product.name ?? "Insurance Plan";
  const underwriterName =
    motorSubType?.underwriter_product.underwriter_name ?? "—";
  const coverLabel =
    cover === "COMPREHENSIVE" ? "Comprehensive" : "Third Party";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      {/* Plan overview */}
      <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#1e3a5f] text-lg leading-tight">
                {productName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {underwriterName}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {coverLabel}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#d7e8ee] pt-5 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
                Vehicle
              </p>
              <div className="flex items-center gap-1.5 font-medium text-[#1e3a5f]">
                <Car className="w-3.5 h-3.5 text-primary" />
                {vehicleDetails.vehicleNumber || "—"}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
                Premium
              </p>
              <p className="font-semibold text-[#1e3a5f]">
                KES {oneTimePayment > 0 ? oneTimePayment.toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment method */}
      {paymentMethods.length > 1 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium px-1">
            Payment Method
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.uiKey;
              return (
                <Card
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.uiKey)}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-[#d7e8ee] bg-white hover:border-primary/40"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-primary/10" : "bg-[#f0f6f9]"}`}
                      >
                        <CreditCard
                          className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-[#1e3a5f]"}`}
                        >
                          {method.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Cover start date */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium px-1">
          Cover Start Date
        </p>
        <Card
          className="border border-[#d7e8ee] shadow-sm cursor-pointer"
          onClick={() => dateInputRef.current?.showPicker()}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Select the date your cover should begin
                </p>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={formatDate(today)}
                  className="w-full border border-[#d7e8ee] rounded-lg px-3 py-2 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total payment */}
      <Card className="border border-[#d7e8ee] shadow-sm bg-gradient-to-r from-[#1e3a5f] to-[#2e5e74]">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-medium">
              Total Premium
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              KES {oneTimePayment > 0 ? oneTimePayment.toLocaleString() : "0"}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* NB note */}
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <span className="font-semibold">Note:</span> Vehicle valuation is
        mandatory for comprehensive products before cover can be activated.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          className="flex-1 text-white"
          onClick={() => router.push("/dashboard/payment-method")}
        >
          Proceed to Payment
        </Button>
      </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
