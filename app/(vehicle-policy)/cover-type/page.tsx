import SelectCoverType from "@/components/cover-type/CoverType"
import { CoverTypesResponse } from "@/types/data"
import { retrieve } from "@/utilities/api-client"
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints"

export const dynamic = "force-dynamic"

export default async function Page() {
  const response = await retrieve<CoverTypesResponse>(
    `${COVER_TYPES_ENDPOINT}?page=1&page_size=3`,
    false
  )

  if (response.error || !response.data) {
    return <div>Failed to load cover types.</div>
  }

  return <SelectCoverType data={response.data} />
}