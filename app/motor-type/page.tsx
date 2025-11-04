import SelectMotorType from "@/components/motor-type/MotorType";
import { MotorTypesResponse } from "@/types/data";
import { retrieve } from "@/utilities/api-client";
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints";

export default async function MotorTypePage() {
  const response = await retrieve(MOTOR_TYPES_ENDPOINT, false);
  const motorTypes = response.data as MotorTypesResponse;

  return (
    <>
      <SelectMotorType data={motorTypes} />
    </>
  );
}
