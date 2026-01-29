"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosClient } from "@/utilities/axios-client";
import { useInsuranceStore } from "@/store/store";
import { useVehicleDetailsStore } from "@/stores/vehicleDetailsStore";
import {
  PaymentMethods,
  StaticBenefit,
  UIMappedPaymentMethod,
} from "@/types/data";

const PaymentSummary = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<UIMappedPaymentMethod[]>(
    [],
  );
  const [oneTimePayment, setOneTimePayment] = useState<number>(0);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const { vehicleDetails } = useVehicleDetailsStore();

  const installments = [
    {
      label: "First Installment",
      amount: 70000,
    },
    {
      label: "Last Installment",
      amount: 91000,
    },
  ];
  const addedBenefits: StaticBenefit[] = [
    { label: "Windscreen", amount: 26000 },
    { label: "Radio Cassette", amount: 31000 },
  ];

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

  const [date, setDate] = useState("");
  const today = new Date();
  useEffect(() => {
    if (motorSubType?.underwriter_product.premium_amount?.one_time_payment) {
      setSelectedPaymentMethod("onetime");
      setOneTimePayment(
        motorSubType?.underwriter_product.premium_amount?.one_time_payment,
      );
    } else {
      setSelectedPaymentMethod("installment");
    }
  }, [motorSubType]);

  useEffect(() => {
    const getPaymentMethods = () => {
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
        .catch((err) => {
          console.error(err);
        });
    };
    getPaymentMethods();
  }, [motorSubType]);

  const methodMapper = (payment_methods: PaymentMethods[]) => {
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
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {paymentMethods.length > 1 &&
          paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethod === method.uiKey;

            return (
              <Card
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-8 cursor-pointer transition-all border-2 rounded-xl
          ${
            isSelected
              ? "border-[#2e5e74] bg-white/80 scale-[1.01]"
              : "border-[#c7dde5] bg-white/60 hover:border-[#9fc3d1]"
          }
        `}
              >
                <h3 className="text-xl font-medium mb-4 text-[#2e5e74]">
                  {method.name}
                </h3>

                <p className="text-sm text-[#4f6f7d] leading-relaxed">
                  {method.description}
                </p>
              </Card>
            );
          })}
      </div>

      {/* Policy Details */}
      <div className="mb-8">
        {/* Plan Details */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center text-color-dark">
            Your Policy Details
          </h3>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 text-primary">Added Benefits</h4>
            {addedBenefits.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between px-4 py-2 rounded-lg mb-2 bg-[#e6f4f1] border-primary text-color-dark"
              >
                <span>{item.label}</span>
                <span>Ksh {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Payment */}
        {selectedPaymentMethod === "onetime" ? (
          <div className="rounded-xl shadow-inner p-6 w-full text-center bg-[#ebf2f4]">
            <h3 className="text-xl font-bold text-gray-700">TOTAL PAYMENT</h3>
            <p className="text-3xl font-extrabold mt-2 text-priamry">
              KES {oneTimePayment.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 mb-8">
            {installments.map((installment, id) => (
              <div
                className="rounded-xl shadow-inner p-6 w-full text-center bg-[#ebf2f4]"
                key={id}
              >
                <h3 className="text-xl font-bold text-gray-700">
                  {installment.label}
                </h3>
                <p className="text-3xl font-extrabold mt-2 text-priamry">
                  {installment.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Registration */}
      <div className="mb-8 text-center">
        <p className="text-[#6b8b98] text-sm mb-2">
          Vehicle Registration Number
        </p>
        <p className="text-2xl font-medium text-[#2e5e74]">
          {vehicleDetails.vehicleNumber ?? ""}
        </p>
      </div>

      {/* Cover Start Date */}
      <div className="mb-12">
        <div className="bg-white p-6 rounded-xl text-center shadow-md w-full">
          <label className="block text-center text-[#6b8b98] text-sm mb-4">
            COVER START DATE
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={formatDate(today)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 py-6 text-sm border-[#9fc3d1] text-[#2e5e74] hover:bg-[#e5f0f3]"
        >
          Back
        </Button>
        <Button className="flex-1 py-6 text-sm bg-[#2e5e74] text-white hover:bg-[#244c5f] font-medium">
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default PaymentSummary;
