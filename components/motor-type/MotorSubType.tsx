"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useInsuranceStore } from "@/stores/insuranceStore";
import {
  AdditionalBenefit,
  MotorSubTypeItem,
  ProductBenefits,
} from "@/types/data";
import {
  POLICY_ENDPOINT,
  PREMIUM_RECALCULATION_ENDPOINT,
} from "@/utilities/endpoints";
import { useVehicleStore } from "@/stores/vehicleStore";
import { axiosClient } from "@/utilities/axios-client";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Building2,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

type BenefitsSectionProps = {
  productId: string;
  includedBenefits?: AdditionalBenefit[];
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  productId,
  includedBenefits,
}) => {
  const [productBenefits, setProductBenefits] = useState<ProductBenefits>();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    axiosClient
      .get("benefit/extras", { params: { underwriter_product_id: productId } })
      .then((response) => setProductBenefits(response.data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <p className="text-xs text-muted-foreground py-2 animate-pulse">
        Loading details…
      </p>
    );
  }

  if (fetchError || !productBenefits) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        Plan details unavailable.
      </p>
    );
  }

  const product_benefits = productBenefits.product_benefits ?? [];
  const applicable_excesses = productBenefits.applicable_excesses ?? [];
  console.log("THE INCLUDED BENEFITS ARE", includedBenefits);

  if (product_benefits.length === 0 && applicable_excesses.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        No additional details available for this plan.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 mb-3">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Product Benefits
        </p>
      </div>
      {/* Product Benefits */}
      {product_benefits.length > 0 && (
        <div>
          <div className="space-y-2">
            {product_benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-2.5 bg-primary/5 rounded-lg px-3 py-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1e3a5f]">
                    {benefit.name ?? "—"}
                  </p>
                  {benefit.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {benefit.description}
                    </p>
                  )}
                  {(benefit.limits?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(benefit.limits ?? []).map((limit, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[10px] font-medium bg-white border border-[#d7e8ee] text-primary px-2 py-0.5 rounded-full"
                        >
                          {limit.label ? `${limit.label}: ` : ""}
                          {limit.amount != null
                            ? Number(limit.amount).toLocaleString()
                            : "—"}{" "}
                          {limit.currency ?? ""}
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
                    {excess.name ?? "—"}
                  </p>
                  {excess.percentage != null && excess.percentage > 0 && (
                    <span className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {excess.percentage}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {excess.percentage != null && excess.percentage > 0
                    ? `${excess.percentage}% of ${excess.percentage_of ?? "—"} . `
                    : ""}
                  Min {excess.minimum_amount?.toLocaleString() ?? "—"}{" "}
                  {excess.currency ?? ""}
                </p>
                {/* temporaary fix check for the 'nil' string: to change to only checking for null in future versions  */}
                {excess.conditions && excess.conditions !== "nil" && (
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

  // Per-product selected add-ons: { [productId]: AdditionalBenefit[] }
  const [selectedBenefitsPerProduct, setSelectedBenefitsPerProduct] = useState<
    Record<string, AdditionalBenefit[]>
  >({});

  // Per-product recalculated premium: { [productId]: number }
  const [recalculatedPremiums, setRecalculatedPremiums] = useState<
    Record<string, number>
  >({});

  // Per-product recalculation loading state: { [productId]: boolean }
  const [recalculatingPremium, setRecalculatingPremium] = useState<
    Record<string, boolean>
  >({});

  const {
    vehicleValue,
    motorType,
    cover: selectedCover,
    tpoOption: tpoCategory,
  } = useInsuranceStore();
  const setVehicleSubType = useInsuranceStore(
    (state) => state.setVehicleSubType,
  );
  const setSelectedAdditionalBenefitIds = useInsuranceStore(
    (state) => state.setSelectedAdditionalBenefitIds,
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
      API_URL = `${BASE_URL}&vehicle_value=${vehicleValue}${urlString ? `&${urlString}` : ""}`;
    }

    if (selectedCover === "THIRD_PARTY") {
      const params = `&tpo_category=${tpoCategory}`;
      const specParam = tpoCategory?.startsWith("COMMERCIAL")
        ? `&tonnage=${tonnage}`
        : seating_capacity
          ? `&seating_capacity=${seating_capacity}`
          : "";
      API_URL = `${BASE_URL}${params}${specParam}`;
    }

    if (API_URL !== "") {
      axiosClient
        .post(API_URL, { additional_benefits: [] })
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
    product_type,
    motor_type,
    seating_capacity,
    selectedCover,
    setCoverStep,
    tonnage,
    tpoCategory,
  ]);

  /**
   * Calls the premium recalculation API for a specific product and updates
   * its displayed premium in local state.
   */
  const recalculatePremium = useCallback(
    async (
      productId: string,
      productRateId: string | undefined,
      selectedBenefits: AdditionalBenefit[],
    ) => {
      setRecalculatingPremium((prev) => ({ ...prev, [productId]: true }));
      try {
        const response = await axiosClient.post(
          PREMIUM_RECALCULATION_ENDPOINT,
          {
            underwriter_product_id: productId,
            vehicle_value: vehicleValue,
            product_rate_id: productRateId,
            additional_benefits: selectedBenefits.map((b) => b.id),
          },
        );
        const data = response.data;
        // Accept either { premium_amount: { one_time_payment } } or { one_time_payment }
        const newPremium =
          data?.premium_amount?.one_time_payment ?? data?.one_time_payment;
        if (newPremium != null) {
          setRecalculatedPremiums((prev) => ({
            ...prev,
            [productId]: newPremium,
          }));
        }
      } catch {
        // Silently keep original premium on error
      } finally {
        setRecalculatingPremium((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [vehicleValue],
  );

  const handleSelect = (item: MotorSubTypeItem) => {
    const product = item.underwriter_product;
    const recalculated = recalculatedPremiums[product.id];

    // Carry the recalculated premium forward if one exists
    const itemToStore: MotorSubTypeItem =
      recalculated != null
        ? {
            ...item,
            underwriter_product: {
              ...product,
              premium_amount: { one_time_payment: recalculated },
            },
          }
        : item;

    setVehicleSubType(itemToStore);

    const selectedBenefits = selectedBenefitsPerProduct[product.id] ?? [];
    setSelectedAdditionalBenefitIds(selectedBenefits.map((b) => b.id));

    const insuringExisting =
      typeof window !== "undefined" &&
      localStorage.getItem("insure_existing_vehicle") === "true";
    if (insuringExisting) {
      router.push("/dashboard/payment-summary");
    } else {
      router.push(
        `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`,
      );
    }
  };

  const getYomRange = (range: number) => {
    const now = new Date().getFullYear();
    return `${now - range} – ${now}`;
  };

  const toggleBenefits = (id: string) => {
    setOpenBenefits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBenefit = (
    event: React.ChangeEvent<HTMLInputElement>,
    benefit: AdditionalBenefit,
    productId: string,
    productRateId: string | undefined,
  ) => {
    setSelectedBenefitsPerProduct((prev) => {
      const current = prev[productId] ?? [];
      const updated = event.target.checked
        ? [...current, benefit]
        : current.filter((b) => b.id !== benefit.id);

      // Recalculate premium for this product with the updated benefit selection
      recalculatePremium(productId, productRateId, updated);

      return { ...prev, [productId]: updated };
    });
  };

  return (
    <>
      {loading ? (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm overflow-hidden animate-pulse"
            >
              <Skeleton className="h-24" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 rounded w-3/4" />
                <Skeleton className="h-3 rounded w-1/2" />
                <Skeleton className="h-10 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error || subtypes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">
            No plans available
          </p>
          <p className="text-sm text-muted-foreground">
            No plans match your selection.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto">
          {subtypes.map((item, index) => {
            const product = item.underwriter_product;
            const isOpen = openBenefits[product?.id] ?? false;
            const hasAdditionalBenefits =
              (product?.additional_benefits?.length ?? 0) > 0;

            const selectedBenefits =
              selectedBenefitsPerProduct[product?.id] ?? [];
            const displayPremium =
              recalculatedPremiums[product?.id] ??
              product?.premium_amount?.one_time_payment;
            const isRecalculating = recalculatingPremium[product?.id] ?? false;

            return (
              <div
                key={index}
                className="bg-white border border-[#d7e8ee] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card header — navy band */}
                <div className="bg-[#1e3a5f] px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-white leading-tight">
                        {product?.name ?? "Unnamed Plan"}
                      </h2>
                      <div className="flex items-start gap-1.5 mt-1">
                        <Building2 className="w-3 h-3 text-white/50 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/60">
                          {product?.underwriter?.name ?? "—"}
                        </p>
                      </div>
                    </div>
                    {displayPremium != null && (
                      <div className="text-right shrink-0">
                        {isRecalculating ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                            <p className="text-xs text-white/60">
                              Recalculating…
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-white">
                            KES {displayPremium.toLocaleString()}
                          </p>
                        )}
                        <p className="text-[10px] text-white/50 uppercase tracking-wide">
                          one-time premium
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {/* Description */}
                  {product?.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {product.description}
                    </p>
                  )}

                  {/* Stat chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.product_rate?.rate != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/5 text-primary border border-primary/15 px-2.5 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {item.product_rate?.rate}% rate
                      </span>
                    )}
                    {product?.period != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#f0f6f9] text-[#1e3a5f] border border-[#d7e8ee] px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {product.period} days
                      </span>
                    )}
                    {product?.subtype && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#f0f6f9] text-[#1e3a5f] border border-[#d7e8ee] px-2.5 py-1 rounded-full">
                        {product.subtype}
                      </span>
                    )}
                    {product?.yom_range != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#f0f6f9] text-[#1e3a5f] border border-[#d7e8ee] px-2.5 py-1 rounded-full">
                        {getYomRange(product.yom_range)}
                      </span>
                    )}
                  </div>

                  {/* Additional benefits for exclusive benefits, user must select option */}
                  {hasAdditionalBenefits && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                          Optional Add-ons
                        </p>
                      </div>
                      <div className="space-y-2">
                        {(product?.additional_benefits ?? []).map((benefit) => {
                          const isChecked = selectedBenefits.some(
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
                              {!benefit.included && (
                                <input
                                  name={benefit.id}
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    toggleBenefit(
                                      e,
                                      benefit,
                                      product.id,
                                      item.product_rate?.id,
                                    )
                                  }
                                  className="accent-primary cursor-pointer shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1e3a5f]">
                                  {benefit.name ?? "—"}
                                </p>
                                {((benefit.base_amount ?? 0) > 0 ||
                                  (benefit.percentage ?? 0) > 0) && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {(benefit.base_amount ?? 0) > 0
                                      ? `${benefit.base_amount!.toLocaleString()} ${benefit.currency ?? ""}`
                                      : `${benefit.percentage}%`}
                                    {(benefit.duration_days ?? 0) > 0 &&
                                      ` · ${benefit.duration_days} days`}
                                  </p>
                                )}
                              </div>
                              {(isChecked || benefit.included || benefit.inclusive) && (
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Toggle plan details */}
                  <button
                    type="button"
                    onClick={() => toggleBenefits(product?.id)}
                    className="w-full flex items-center justify-between text-sm font-medium text-primary hover:bg-primary/5 rounded-lg px-3 py-2.5 transition-colors border border-primary/15 mb-3"
                  >
                    <span>{isOpen ? "Hide" : "View"} plan details</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mb-4 border border-[#d7e8ee] rounded-xl p-4">
                      <BenefitsSection
                        productId={product?.id}
                        {...(item.product_rate
                          ?.additional_benefit_inclusivity ===
                          "ALL_INCLUSIVE" &&
                          hasAdditionalBenefits && {
                            includedBenefits: product.additional_benefits,
                          })}
                      />
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button
                      size="lg"
                      onClick={() => handleSelect(item)}
                      disabled={isRecalculating}
                      className="w-full bg-[#1e3a5f] hover:bg-[#397397] text-white gap-2"
                    >
                      Select Plan <ArrowRight className="w-4 h-4" />
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
