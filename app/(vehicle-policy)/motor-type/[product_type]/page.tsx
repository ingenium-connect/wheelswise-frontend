import SelectMotorType from "@/components/motor-type/MotorType";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import { MotorType, MotorTypesResponse } from "@/types/data";
import { axiosServer } from "@/utilities/axios-server";
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints";
import { isAxiosError } from "axios";

export const dynamic = "force-dynamic";

export default async function MotorTypePage({
  params,
}: {
  params: Promise<{ product_type: string }>;
}) {
  let response;
  let errorMsg;
  try {
    const res = await axiosServer.get(MOTOR_TYPES_ENDPOINT);
    response = res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err?.response?.status === 404) {
        errorMsg = "Page not found";
      }
    }
  }

  const { product_type } = await params;

  const filteredResponse: MotorTypesResponse =
    product_type === "THIRD_PARTY"
      ? {
          ...response,
          motor_types: response.motor_types.filter((mt: MotorType) =>
            ["PRIVATE", "COMMERCIAL", "MOTORBIKE"].includes(
              mt.name.toUpperCase(),
            ),
          ),
        }
      : response;

  return response ? (
    <>
      <FlowStepHeader
        step={1}
        totalSteps={5}
        title="Choose Motor Type"
        subtitle="Select the category that best describes your vehicle."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <SelectMotorType data={filteredResponse} />
      </div>
    </>
  ) : (
    <p>{errorMsg}</p>
  );
}
