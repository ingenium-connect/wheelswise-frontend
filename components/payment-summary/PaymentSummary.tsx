"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { proxyGet, proxyPost } from "@/utilities/api-proxy";
import { useInsuranceStore } from "@/stores/insuranceStore";
import {
  AdditionalBenefit,
  PaymentMethods,
  UIMappedPaymentMethod,
} from "@/types/data";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

/* ── Types ── */

type ConflictPolicy = {
  cover_end_date: string;
  insurance_certificate_no: string;
  member_company_name: string;
  registration_number: string;
  chassis_number: string;
};

type DoubleInsuranceStatus = "idle" | "checking" | "conflict" | "clear";

/* ── Date helpers ── */

function toApiDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/* ── Component ── */

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

const PaymentSummary = () => {
  const router = useRouter();

  // ── All hooks declared unconditionally at the top ──
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<UIMappedPaymentMethod[]>([]);
  const [oneTimePayment, setOneTimePayment] = useState<number>(0);
  const [date, setDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [doubleInsuranceStatus, setDoubleInsuranceStatus] = useState<DoubleInsuranceStatus>("idle");
  const [conflictPolicies, setConflictPolicies] = useState<ConflictPolicy[]>([]);
  const [additionalBenefits, setAdditionalBenefits] = useState<AdditionalBenefit[]>([]);

  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const cover = useInsuranceStore((s) => s.cover);
  const selectedAdditionalBenefitIds = useInsuranceStore((s) => s.selectedAdditionalBenefitIds);
  const { vehicleDetails } = useVehicleStore();

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const today = new Date();

  // Derived booleans — used to gate effects below without breaking hook order
  const hasRequiredData = Boolean(motorSubType && cover && vehicleDetails.vehicleNumber);

  // Redirect if data is missing
  useEffect(() => {
    if (!hasRequiredData) {
      toast.error("Missing insurance details. Please start from the beginning.");
      router.push("/cover-type");
    }
  }, [hasRequiredData, router]);

  // Set default payment method from product data
  useEffect(() => {
    if (!motorSubType) return;
    if (motorSubType.underwriter_product.premium_amount?.one_time_payment) {
      setSelectedPaymentMethod("onetime");
      setOneTimePayment(motorSubType.underwriter_product.premium_amount.one_time_payment);
    } else {
      setSelectedPaymentMethod("installment");
    }
  }, [motorSubType]);

  const methodMapper = useCallback((payment_methods: PaymentMethods[]) => {
    return payment_methods
      .map((method: UIMappedPaymentMethod) => {
        const mapped = MappedPaymentMethods[method.name];
        if (!mapped) return null;
        return { ...method, name: mapped.name, description: mapped.description, uiKey: mapped.key };
      })
      .filter(Boolean) as UIMappedPaymentMethod[];
  }, []);

  // Fetch payment methods via proxy (authenticated)
  useEffect(() => {
    const underwriterId = motorSubType?.underwriter_product.underwriter_id;
    if (!underwriterId) return;

    proxyGet<{ payment_method: PaymentMethods[] }>(
      `payment-method`,
      { underwriter_id: underwriterId },
    )
      .then((data) => {
        const mappedMethods = methodMapper(data?.payment_method ?? []);
        setPaymentMethods(mappedMethods);
        if (mappedMethods.length > 0) {
          localStorage.setItem("payment_method_id", mappedMethods[0].id);
          setSelectedPaymentMethod(mappedMethods[0].uiKey);
        }
      })
      .catch(() => {
        toast.error("Could not load payment methods. Please refresh the page.");
      });
  }, [motorSubType, methodMapper]);

  // Fetch additional benefits via proxy (authenticated)
  useEffect(() => {
    if (selectedAdditionalBenefitIds.length === 0) return;

    proxyPost<AdditionalBenefit[]>("benefit/additional", { ids: selectedAdditionalBenefitIds })
      .then((data) => setAdditionalBenefits(data ?? []))
      .catch(() => {
        toast.error("Could not load selected add-ons.");
      });
  }, [selectedAdditionalBenefitIds]);

  // Double-insurance check
  useEffect(() => {
    if (!date) return;
    const period = motorSubType?.underwriter_product?.period;
    const regNum = vehicleDetails.vehicleNumber;
    if (period == null || !regNum) return;

    fetch("/api/double-insurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        policy_start_date: toApiDate(date),
        policy_end_date: toApiDate(addDays(date, Number(period))),
        vehicle_registration_number: regNum,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const conflicts: ConflictPolicy[] = data.callback_obj?.double_insurance ?? [];
        if (data.success && conflicts.length > 0) {
          setDoubleInsuranceStatus("conflict");
          setConflictPolicies(conflicts);
        } else {
          setDoubleInsuranceStatus("clear");
        }
      })
      .catch(() => {
        setDoubleInsuranceStatus("clear");
      });
  }, [date, motorSubType, vehicleDetails.vehicleNumber]);

  // ── Derived display values ──
  const productName = motorSubType?.underwriter_product.name ?? "Insurance Plan";
  const underwriterName =
    motorSubType?.underwriter_product.underwriter_name ||
    motorSubType?.underwriter_product.underwriter?.name ||
    "—";
  const coverLabel = cover === "COMPREHENSIVE" ? "Comprehensive" : "Third Party";

  const coverStartDate = (selectedDate: string) => {
    setDate(selectedDate);
    localStorage.setItem("policy_start_date", selectedDate);
    if (selectedDate) {
      setDoubleInsuranceStatus("checking");
      setConflictPolicies([]);
    } else {
      setDoubleInsuranceStatus("idle");
    }
  };

  const canProceed =
    !!date &&
    paymentMethods.length > 0 &&
    doubleInsuranceStatus !== "checking" &&
    doubleInsuranceStatus !== "conflict";

  // ── Loading / missing-data guard rendered AFTER all hooks ──
  if (!hasRequiredData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm p-6 md:p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your details…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Plan overview */}
        <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#1e3a5f] text-lg leading-tight">
                    {productName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {underwriterName}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0 self-start">
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

        {/* Additional benefits */}
        {additionalBenefits.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium px-1">
              Add-ons
            </p>
            <Card className="border border-[#d7e8ee] shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-[#d7e8ee]">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm font-semibold text-[#1e3a5f]">
                    Selected Add-ons
                  </p>
                </div>
                {additionalBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm text-[#1e3a5f] truncate">
                        {benefit.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#1e3a5f] shrink-0">
                      {benefit.base_amount > 0
                        ? `${benefit.currency} ${benefit.base_amount.toLocaleString()}`
                        : `${benefit.percentage}%`}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                    onChange={(e) => coverStartDate(e.target.value)}
                    min={formatDate(today)}
                    className="w-full border border-[#d7e8ee] rounded-lg px-3 py-2 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Double-insurance check result */}
          {doubleInsuranceStatus === "checking" && (
            <div className="flex items-center gap-3 mt-3 px-4 py-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Checking for existing coverage
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Verifying this vehicle has no active policy for the selected period…
                </p>
              </div>
            </div>
          )}

          {doubleInsuranceStatus === "clear" && (
            <div className="flex items-center gap-2.5 mt-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-700">
                Coverage check complete.
              </p>
            </div>
          )}

          {doubleInsuranceStatus === "conflict" && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm font-semibold text-amber-800">
                  Existing coverage detected
                </p>
              </div>

              <div className="space-y-2">
                {conflictPolicies.map((p) => (
                  <div
                    key={p.insurance_certificate_no}
                    className="bg-white border border-amber-200 rounded-lg px-4 py-3 space-y-1"
                  >
                    <p className="text-sm font-semibold text-[#1e3a5f]">
                      {p.member_company_name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span>Certificate: {p.insurance_certificate_no}</span>
                      <span>Reg: {p.registration_number}</span>
                      <span>Expires: {p.cover_end_date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-amber-700">
                This vehicle already has active coverage during the selected
                period. Please choose a different start date.
              </p>
            </div>
          )}
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
            disabled={!canProceed}
          >
            {doubleInsuranceStatus === "checking"
              ? "Checking coverage…"
              : "Proceed to Payment"}
          </Button>
        </div>
        {paymentMethods.length === 0 && (
          <p className="text-xs text-red-500 text-center -mt-2">
            Payment methods unavailable. Please refresh the page to try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
