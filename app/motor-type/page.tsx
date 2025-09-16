import SelectMotorType from "@/components/motor-type/MotorType";
import { MotorTypesResponse } from "@/types/data";
import { getData } from "@/utilities/api";
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints";

export default async function MotorTypePage() {
  const response: MotorTypesResponse = await getData(
    MOTOR_TYPES_ENDPOINT,
    false
  );

  return (
    <>
      <SelectMotorType data={response} />
    </>
  );
}
