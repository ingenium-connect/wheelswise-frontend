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
      <div className="pt-24 pb-20 px-4 mx-auto">
        {loading ? (
          <p className="text-center text-gray-600">Loading motor subtypes...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : subtypes.length === 0 ? (
          <p className="text-center text-gray-500">
            No motor subtypes available.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {subtypes.map((item, index) => {
              const product = item.underwriter_product;

              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#c7dde5] shadow-sm hover:shadow-xl hover:border-[#397397] transition-all duration-200 p-6 min-h-[280px] flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-[#397397] uppercase tracking-wide">
                      {product.name}
                    </h2>

                    <p className="text-base text-gray-600 mt-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <ul className="text-base text-gray-700 space-y-2">
                      <li>
                        <span className="font-medium text-gray-800">
                          Subtype:
                        </span>{" "}
                        {product.subtype}
                      </li>
                      <li>
                        <span className="font-medium text-gray-800">
                          Premium:
                        </span>{" "}
                        KES{" "}
                        {product.premium_amount?.one_time_payment.toLocaleString()}
                      </li>
                      {item.product_rate && (
                        <li>
                          <span className="font-medium text-gray-800">
                            Rate:
                          </span>{" "}
                          {item.product_rate?.rate}%
                        </li>
                      )}
                      <li>
                        <span className="font-medium text-gray-800">
                          Period:
                        </span>{" "}
                        {product.period} days
                      </li>
                      <li>
                        <span className="font-medium text-gray-800">
                          Year of Manufacture Range:
                        </span>{" "}
                        {getYomRange(product.yom_range)}
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Additional benefits</p>
                    {item.underwriter_product.additional_benefits.map(
                      (benefit) => (
                        <div key={benefit.id}>
                          <input
                            name={benefit.id}
                            onChange={(event) => addBenefit(event, benefit)}
                            className="cursor-pointer"
                            type="checkbox"
                          />
                          <label
                            htmlFor={benefit.id}
                            className="pl-2 cursor-pointer"
                          >
                            {benefit.name}
                          </label>
                        </div>
                      ),
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    className="mt-4 flex not-first: justify-between  px-2 cursor-pointer py-2 hover:bg-primary/10 rounded-md text-primary font-bold"
                    onClick={() => setShowBenefits(!showBenefits)}
                  >
                    Click to {showBenefits ? "hide" : "view"} benefits{" "}
                    {!showBenefits ? (
                      <LucideChevronDown />
                    ) : (
                      <LucideChevronUp />
                    )}
                  </Button>
                  {/* product benefits section */}
                  {showBenefits && (
                    <div>
                      <BenefitsSection
                        productId={item.underwriter_product.id}
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <Button
                      size="lg"
                      onClick={() => handleSelect(item)}
                      className="w-full text-white py-3 text-sm tracking-wide transition"
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MotorSubtype;
