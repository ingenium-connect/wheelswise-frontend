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
import { LucideChevronDown, LucideChevronUp } from "lucide-react";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

type BenefitsSectionProps = {
  productId: string;
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ productId }) => {
  const [productBenefits, setProductBenefits] = useState<ProductBenefits>();

  useEffect(() => {
    const fetchProductBenefits = () => {
      axiosClient
        .get("benefit/extras", {
          params: {
            underwriter_product_id: productId,
          },
        })
        .then((response) => setProductBenefits(response.data));
    };

    fetchProductBenefits();
  }, [productId]);

  return (
    <div className="flex flex-wrap gap-4">
      {productBenefits ? (
        <>
          <div>
            <p className="font-bold">Product benefits</p>
            {productBenefits.product_benefits.map((benefit) => (
              <ul className="pl-4" key={benefit.id}>
                <li className="cursor-pointer list-disc">{benefit.name}</li>
              </ul>
            ))}
          </div>
          <div>
            <p className="font-bold">Applicable excesses</p>
            {productBenefits.applicable_excesses.map((benefit) => (
              <ul className="pl-4" key={benefit.id}>
                <li className="cursor-pointer list-disc">
                  {benefit.name}
                  <p>{`${benefit.percentage}% of ${benefit.percentage_of}. Minimum amount ${benefit.minimum_amount}${benefit.currency}`}</p>
                  {benefit.conditions && <p>Condition: {benefit.conditions}</p>}
                </li>
              </ul>
            ))}
          </div>
        </>
      ) : (
        <p>Loading benefits...</p>
      )}
    </div>
  );
};

const MotorSubtype: React.FC<Props> = ({ motor_type, product_type }: Props) => {
  const router = useRouter();
  const [subtypes, setSubtypes] = useState<MotorSubTypeItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBenefits, setShowBenefits] = useState(false);
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

    const fetchSubtypes = () => {
      axiosClient
        .post(API_URL, {
          additional_benefits: additionalBenefits,
        })
        .then((res) => {
          const data = res.data;
          setSubtypes(data.underwriter_products || []);
        })
        .catch((err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          setError(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (API_URL !== "") {
      fetchSubtypes();
    }
    setCoverStep(3);
  }, [motorType?.name, vehicleValue, additionalBenefits, product_type, motor_type, seating_capacity, selectedCover, setCoverStep, tonnage, tpoCategory]);

  const handleSelect = (product: MotorSubTypeItem) => {
    setVehicleSubType(product);
    router.push(
      `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`,
    );
  };

  /**
   * Returns the year ranges for a specific product
   * @param range the range of year of manufacture
   */
  const getYomRange = (range: number) => {
    const now = new Date().getFullYear();
    const startDate = now - range;
    return `${startDate} - ${now}`;
  };

  /**
   * adds additional benefits
   * @param benefit an additional benefit object
   */
  const addBenefit = (
    event: React.ChangeEvent<HTMLInputElement>,
    benefit: AdditionalBenefit,
  ) => {
    // return early if benefit is already added
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
        <p className="text-center text-muted-foreground py-12">Loading plans...</p>
      ) : error ? (
        <p className="text-red-600 text-center py-12">{error}</p>
      ) : subtypes.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No plans available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {subtypes.map((item, index) => {
            const product = item.underwriter_product;

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
                        <p className="text-xs text-muted-foreground mt-0.5">{product.underwriter_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-primary">
                          KES {product.premium_amount?.one_time_payment.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">one-time premium</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Details grid */}
                  <div className="border-t border-[#d7e8ee] pt-4 mb-4 text-sm divide-y divide-[#d7e8ee]">
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Subtype</p>
                      <p className="font-medium text-[#1e3a5f]">{product.subtype}</p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Rate</p>
                      <p className="font-bold text-[#1e3a5f]">{item.product_rate ? `${item.product_rate.rate}%` : "—"}</p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Period</p>
                      <p className="font-medium text-[#1e3a5f]">{product.period} days</p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">YOM Range</p>
                      <p className="font-medium text-[#1e3a5f]">{getYomRange(product.yom_range)}</p>
                    </div>
                  </div>

                  {/* Additional benefits */}
                  {item.underwriter_product.additional_benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        Additional Benefits
                      </p>
                      <div className="space-y-1.5">
                        {item.underwriter_product.additional_benefits.map((benefit) => (
                          <label key={benefit.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              name={benefit.id}
                              onChange={(event) => addBenefit(event, benefit)}
                              type="checkbox"
                              className="accent-primary cursor-pointer"
                            />
                            <span className="text-sm text-[#1e3a5f]">{benefit.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Toggle product benefits */}
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-primary hover:bg-primary/5 mb-4"
                    onClick={() => setShowBenefits(!showBenefits)}
                  >
                    {showBenefits ? "Hide" : "View"} product benefits
                    {showBenefits ? <LucideChevronUp className="w-4 h-4" /> : <LucideChevronDown className="w-4 h-4" />}
                  </Button>

                  {showBenefits && (
                    <div className="mb-4">
                      <BenefitsSection productId={item.underwriter_product.id} />
                    </div>
                  )}

                  <div className="mt-auto">
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
