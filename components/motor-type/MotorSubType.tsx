"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useInsuranceStore } from "@/stores/insuranceStore";
import {
  AdditionalBenefit,
  MotorSubTypeItem,
  ProductBenefits,
} from "@/types/data";
import { POLICY_ENDPOINT } from "@/utilities/endpoints";
import { useVehicleStore } from "@/stores/vehicleStore";
import { axiosClient } from "@/utilities/axios-client";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

type BenefitsSectionProps = {
  productId: string;
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ productId }) => {
  const [productBenefits, setProductBenefits] = useState<ProductBenefits>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("benefit/extras", { params: { underwriter_product_id: productId } })
      .then((response) => setProductBenefits(response.data))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <p className="text-xs text-muted-foreground py-2 animate-pulse">
        Loading details…
      </p>
    );
  }

  if (!productBenefits) return null;

  const { product_benefits, applicable_excesses } = productBenefits;

  return (
    <div className="space-y-5">
      {/* Product Benefits */}
      {product_benefits.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Product Benefits
            </p>
          </div>
          <div className="space-y-2">
            {product_benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-2.5 bg-primary/5 rounded-lg px-3 py-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1e3a5f]">
                    {benefit.name}
                  </p>
                  {benefit.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {benefit.description}
                    </p>
                  )}
                  {benefit.limits && benefit.limits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {benefit.limits.map((limit, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[10px] font-medium bg-white border border-[#d7e8ee] text-primary px-2 py-0.5 rounded-full"
                        >
                          {limit.label ? `${limit.label}: ` : ""}
                          {Number(limit.amount).toLocaleString()} {limit.currency}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applicable Excesses */}
      {applicable_excesses.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Applicable Excesses
            </p>
          </div>
          <div className="space-y-2">
            {applicable_excesses.map((excess) => (
              <div
                key={excess.id}
                className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#1e3a5f]">
                    {excess.name}
                  </p>
                  <span className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {excess.percentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {excess.percentage}% of {excess.percentage_of} · Min{" "}
                  {excess.minimum_amount.toLocaleString()} {excess.currency}
                </p>
                {excess.conditions && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    {excess.conditions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MotorSubtype: React.FC<Props> = ({ motor_type, product_type }: Props) => {
  const router = useRouter();
  const [subtypes, setSubtypes] = useState<MotorSubTypeItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openBenefits, setOpenBenefits] = useState<Record<string, boolean>>({});
  const [additionalBenefits, setAdditionalBenefits] = useState<
    AdditionalBenefit[]
  >([]);
  const {
    vehicleValue,
    motorType,
    cover: selectedCover,
    tpoOption: tpoCategory,
  } = useInsuranceStore();
  const setVehicleSubType = useInsuranceStore(
    (state) => state.setVehicleSubType,
  );
  const { seating_capacity, tonnage } = useVehicleStore();
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  useEffect(() => {
    let API_URL = "";
    const BASE_URL = `${POLICY_ENDPOINT}/products/subtype/${motorType?.name}?product_type=${product_type}`;

    if (product_type === "COMPREHENSIVE" && motorType?.name) {
      const urlString =
        motor_type === "PSV"
          ? `seating_capacity=${seating_capacity}`
          : ["COMMERCIAL", "PRIME COMMERCIAL VEHICLES"].includes(motorType.name)
            ? `tonnage=${tonnage}`
            : "";
      API_URL = `${BASE_URL}&vehicle_value=${vehicleValue}&${urlString}`;
    }

    if (selectedCover === "THIRD_PARTY") {
      const urlString = `&tpo_category=${tpoCategory}&tonnage=${tonnage}`;
      API_URL = `${BASE_URL}${urlString}`;
    }

    if (API_URL !== "") {
      axiosClient
        .post(API_URL, { additional_benefits: additionalBenefits })
        .then((res) => {
          setSubtypes(res.data.underwriter_products || []);
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred",
          );
        })
        .finally(() => setLoading(false));
    }
    setCoverStep(3);
  }, [
    motorType?.name,
    vehicleValue,
    additionalBenefits,
    product_type,
    motor_type,
    seating_capacity,
    selectedCover,
    setCoverStep,
    tonnage,
    tpoCategory,
  ]);

  const handleSelect = (product: MotorSubTypeItem) => {
    setVehicleSubType(product);
    router.push(
      `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`,
    );
  };

  const getYomRange = (range: number) => {
    const now = new Date().getFullYear();
    return `${now - range} – ${now}`;
  };

  const toggleBenefits = (id: string) => {
    setOpenBenefits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addBenefit = (
    event: React.ChangeEvent<HTMLInputElement>,
    benefit: AdditionalBenefit,
  ) => {
    if (additionalBenefits.includes(benefit)) return;
    if (event.target.checked) {
      setAdditionalBenefits([...additionalBenefits, benefit]);
    } else {
      setAdditionalBenefits(
        additionalBenefits.filter((item) => item.id !== benefit.id),
      );
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-center text-muted-foreground py-12">
          Loading plans…
        </p>
      ) : error ? (
        <p className="text-red-600 text-center py-12">{error}</p>
      ) : subtypes.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No plans available.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {subtypes.map((item, index) => {
            const product = item.underwriter_product;
            const isOpen = openBenefits[product.id] ?? false;
            const hasAdditionalBenefits =
              product.additional_benefits.length > 0;

            return (
              <div
                key={index}
                className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />

                <div className="p-6 flex flex-col flex-grow">
                  {/* Plan header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-wide">
                          {product.name}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.underwriter_name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-primary">
                          KES{" "}
                          {product.premium_amount?.one_time_payment.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          one-time premium
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Details grid */}
                  <div className="border-t border-[#d7e8ee] pt-4 mb-4 text-sm divide-y divide-[#d7e8ee]">
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Subtype
                      </p>
                      <p className="font-medium text-[#1e3a5f]">
                        {product.subtype}
                      </p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Rate
                      </p>
                      <p className="font-bold text-[#1e3a5f]">
                        {item.product_rate ? `${item.product_rate.rate}%` : "—"}
                      </p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Period
                      </p>
                      <p className="font-medium text-[#1e3a5f]">
                        {product.period} days
                      </p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        YOM Range
                      </p>
                      <p className="font-medium text-[#1e3a5f]">
                        {getYomRange(product.yom_range)}
                      </p>
                    </div>
                  </div>

                  {/* Additional benefits */}
                  {hasAdditionalBenefits && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                          Additional Benefits
                        </p>
                      </div>
                      <div className="space-y-2">
                        {product.additional_benefits.map((benefit) => {
                          const isChecked = additionalBenefits.some(
                            (b) => b.id === benefit.id,
                          );
                          return (
                            <label
                              key={benefit.id}
                              className={cn(
                                "flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                                isChecked
                                  ? "border-primary bg-primary/5"
                                  : "border-[#d7e8ee] hover:bg-[#f0f6f9]",
                              )}
                            >
                              <input
                                name={benefit.id}
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => addBenefit(e, benefit)}
                                className="accent-primary cursor-pointer shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1e3a5f]">
                                  {benefit.name}
                                </p>
                                {(benefit.base_amount > 0 ||
                                  benefit.percentage > 0) && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {benefit.base_amount > 0
                                      ? `${benefit.base_amount.toLocaleString()} ${benefit.currency}`
                                      : `${benefit.percentage}%`}
                                    {benefit.duration_days > 0 &&
                                      ` · ${benefit.duration_days} days`}
                                  </p>
                                )}
                              </div>
                              {isChecked && (
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Toggle product benefits */}
                  <button
                    type="button"
                    onClick={() => toggleBenefits(product.id)}
                    className="w-full flex items-center justify-between text-sm font-medium text-primary hover:bg-primary/5 rounded-lg px-3 py-2.5 transition-colors mb-2"
                  >
                    <span>
                      {isOpen ? "Hide" : "View"} plan details
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mb-4 border border-[#d7e8ee] rounded-xl p-4">
                      <BenefitsSection productId={product.id} />
                    </div>
                  )}

                  <div className="mt-auto pt-2">
                    <Button
                      size="lg"
                      onClick={() => handleSelect(item)}
                      className="w-full text-white"
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MotorSubtype;
