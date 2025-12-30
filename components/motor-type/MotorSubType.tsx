"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useInsuranceStore } from "@/store/store";
import { MotorSubTypeItem } from "@/types/data";
import { POLICY_ENDPOINT } from "@/utilities/endpoints";
import { useVehicleStore } from "@/stores/vehicleStore";
import { axiosClient } from "@/utilities/axios-client";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const MotorSubtype: React.FC<Props> = ({ motor_type, product_type }: Props) => {
  const router = useRouter();
  const [subtypes, setSubtypes] = useState<MotorSubTypeItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const vehicleValue = useInsuranceStore((state) => state.vehicleValue);
  const motorType = useInsuranceStore((state) => state.motorType);
  const selectedCover = useInsuranceStore((state) => state.cover);
  const tpoCategory = useInsuranceStore((state) => state.tpoOption);
  const setVehicleSubType = useInsuranceStore(
    (state) => state.setVehicleSubType
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
      const urlString = `&tpo_category=${tpoCategory}`;
      API_URL = `${BASE_URL}${urlString}`;
    }

    const fetchSubtypes = () => {
      axiosClient
        .post(API_URL, {
          additional_benefits: [],
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

    fetchSubtypes();
    setCoverStep(3);
  }, [motorType?.name, vehicleValue]);

  const handleSelect = (product: MotorSubTypeItem) => {
    setVehicleSubType(product);
    router.push(
      `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`
    );
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
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                    </ul>
                  </div>

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
