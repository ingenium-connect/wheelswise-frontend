import SelectCoverType from "@/components/cover-type/CoverType";
import { CoverTypesResponse } from "@/types/data";
import { retrieve } from "@/utilities/api-client";
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints";

export default async function Page() {
  const response = await retrieve(
    `${COVER_TYPES_ENDPOINT}?page=1&page_size=3`,
    false
  );
  const covertTypes = response.data as CoverTypesResponse;

  return (
    <>
      <SelectCoverType data={covertTypes} />
    </>
  );
}
