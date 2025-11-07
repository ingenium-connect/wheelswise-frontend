import SelectMotorType from "@/components/motor-type/MotorType"
import { MotorTypesResponse } from "@/types/data"
import { retrieve } from "@/utilities/api-client"
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints"

export const dynamic = "force-dynamic"

export default async function MotorTypePage() {
  const response = await retrieve<MotorTypesResponse>(MOTOR_TYPES_ENDPOINT, false)

  if (response.error || !response.data) {
    return <div>Failed to load motor types.</div>
  }

  return <SelectMotorType data={response.data} />
}
