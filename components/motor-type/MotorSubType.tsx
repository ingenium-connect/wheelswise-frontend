"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MotorType {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface ProductRate {
  rate: number;
}

interface UnderwriterProduct {
  name: string;
  description: string;
  subtype: string;
  premium_amount: {
    one_time_payment: number;
  };
  tonnes: string[];
}

interface SubtypeItem {
  underwriter_product: UnderwriterProduct;
  product_rate: ProductRate;
}

const MotorSubtype: React.FC = () => {
  const router = useRouter();
  const [selectedMotorType, setSelectedMotorType] = useState<MotorType | null>(
    null
  );
  const [vehicleValue, setVehicleValue] = useState<string>("");
  const [subtypes, setSubtypes] = useState<SubtypeItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const primaryColor = "#397397";
  const primaryDark = "#2e5e74";

  useEffect(() => {
    // Get the selected motor type and vehicle value from localStorage
    const storedMotorType = localStorage.getItem("selectedMotorType");
    const storedVehicleValue = localStorage.getItem("vehicleValue");

    if (storedMotorType) {
      setSelectedMotorType(JSON.parse(storedMotorType));
    }
    if (storedVehicleValue) {
      setVehicleValue(storedVehicleValue);
    }
  }, []);

  useEffect(() => {
    if (!selectedMotorType || !vehicleValue) return;

    const API_URL = `/api/policies/products/subtype/${selectedMotorType.name}?product_type=COMPREHENSIVE&vehicle_value=${vehicleValue}&year_of_manufacture=2023`;

    const fetchSubtypes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch motor subtypes");

        setSubtypes(data.underwriter_products || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtypes();
  }, [selectedMotorType, vehicleValue]);

  const handleSelect = (product: SubtypeItem) => {
    alert(`Selected subtype: ${product.underwriter_product.name}`);
    // Store the selected product in localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    // navigate("/next-step", { state: { motorType: selectedMotorType, vehicleValue, selectedProduct: product } });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#397397] text-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 md:px-16 h-16">
          <button
            onClick={() => router.back()}
            className="hover:underline font-medium"
          >
            ← Go Back
          </button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            Step Three: Choose Motor Subtype
          </h1>
          <div className="w-24" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4 md:px-16 flex-grow">
        {loading ? (
          <p className="text-center text-gray-600">Loading motor subtypes...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : subtypes.length === 0 ? (
          <p className="text-center text-gray-500">
            No motor subtypes available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                      {product.tonnes?.length > 0 && (
                        <li>
                          <strong>Tonnage:</strong> {product.tonnes.join(", ")}{" "}
                          tons
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleSelect(item)}
                      className="w-full text-white py-2 text-sm rounded-md font-medium transition"
                      style={{ backgroundColor: primaryColor }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = primaryDark;
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = primaryColor;
                      }}
                    >
                      Select
                    </button>
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
