import SelectCoverType from "@/components/cover-type/CoverType";
import { CoverTypesResponse } from "@/types/data";
import { getData } from "@/utilities/api";
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints";

export default async function Page() {
  const response: CoverTypesResponse = await getData(
    `${COVER_TYPES_ENDPOINT}?page=1&page_size=3`,
    false
  );

  return (
    <>
      <SelectCoverType data={response} />
    </>
  );
}
