"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useInsuranceStore } from "@/store/store";

const VehicleDetails = ({
  modelMakeMap,
}: {
  modelMakeMap: { make: string; models: string[] }[];
}) => {
  const router = useRouter();
  const vehicleValue = useInsuranceStore((store) => store.vehicleValue);
  const motorSubType = useInsuranceStore((Store) => Store.motorSubtype)
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);
  const [models, setModels] = useState<string[]>([]);

  const [form, setForm] = useState({
    vehicleValue: vehicleValue,
    engineCapacity: "",
    vehicleNumber: "",
    chassisNumber: "",
    make: "",
    model: "",
    year: "",
  });

  useEffect(() => {
    setCoverStep(4);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "make") {
      const modelMake = modelMakeMap.find(
        (modelMake) => modelMake.make === e.target.value
      );
      const models = modelMake?.models ?? [];
      setModels(models);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/personal-details");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl p-8 rounded-tl-[40px] rounded-br-[40px]">
        <h2 className="text-2xl md:text-3xl text-primary font-bold text-center mb-4">
          Vehicle Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label>Vehicle value</label>
            <input
              type="number"
              name="vehicleValue"
              value={form.vehicleValue}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
            />
          </div>

          <input
            type="text"
            name="engineCapacity"
            value={form.engineCapacity}
            onChange={handleChange}
            placeholder="Enter the Engine cc e.g. 1800CC"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <input
            type="text"
            name="chassisNumber"
            value={form.chassisNumber}
            onChange={handleChange}
            placeholder="Chassis Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          />

          <select
            name="make"
            value={form.make}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          >
            <option value="">Select Make</option>
            {modelMakeMap.map((modelMake) => (
              <option value={modelMake.make} key={modelMake.make}>
                {modelMake.make}
              </option>
            ))}
          </select>

          <select
            name="model"
            value={form.model}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option value={model} key={model}>
                {model}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
          >
            <option value="">Year of Manufacture</option>
            {Array.from({ length: motorSubType?.underwriter_product.yom_range ?? 0 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="text-white transition">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleDetails;
