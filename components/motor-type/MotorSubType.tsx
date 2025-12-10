"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { postHandler } from "@/utilities/api";
import { useInsuranceStore } from "@/store/store";
import { MotorSubTypeItem } from "@/types/data";
import { POLICY_ENDPOINT } from "@/utilities/endpoints";
import { useVehicleStore } from "@/stores/vehicleStore";

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

    const fetchSubtypes = async () => {
      try {
        const data = await postHandler(API_URL, false, {
          additional_benefits: [],
        });
        setSubtypes(data.underwriter_products || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
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
      <div className="pt-24 pb-20 px-4 flex-grow">
        {loading ? (
          <p className="text-center text-gray-600">Loading motor subtypes...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : subtypes.length === 0 ? (
          <p className="text-center text-gray-500">
            No motor subtypes available.
          </p>
        ) : (
          <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(200px,400px))]">
            {subtypes.map((item, index) => {
              const product = item.underwriter_product;
              const rate = item.product_rate;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 hover:border-[#397397] transition p-4 max-w-sm mx-auto flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-[#397397] uppercase">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      {product.description}
                    </p>

                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        <strong>Rate:</strong> {rate?.rate ?? "N/A"}%
                      </li>
                      <li>
                        <strong>Subtype:</strong> {product.subtype}
                      </li>
                      <li>
                        <strong>Premium:</strong> KES{" "}
                        {product.premium_amount?.one_time_payment.toLocaleString()}
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => handleSelect(item)}
                      className="text-white transition"
                    >
                      Select
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
