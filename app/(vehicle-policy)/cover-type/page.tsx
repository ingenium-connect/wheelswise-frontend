import SelectCoverType from "@/components/cover-type/CoverType";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import { CoverTypesResponse } from "@/types/data";
import { axiosServer } from "@/utilities/axios-server";
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints";
import { isAxiosError } from "axios";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose Your Cover Type — Comprehensive or Third Party",
  description:
    "Select between comprehensive motor insurance and third party only (TPO) cover. Compare options and get an instant quote from IRA-licensed underwriters in Kenya.",
  alternates: { canonical: "/cover-type" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let response: CoverTypesResponse | undefined = undefined;
  let errorMsg: string = "Failed to load cover types.";

  try {
    const res = await axiosServer.get(
      `${COVER_TYPES_ENDPOINT}/?page=1&page_size=3`,
    );
    response = res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err?.response?.status === 404) {
        errorMsg = "Page not found";
      }
    }
  }

  return response ? (
    <>
      <FlowStepHeader
        title="Choose a Cover"
        subtitle="Select the type of cover that suits your needs."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <SelectCoverType data={response} />
      </div>
    </>
  ) : (
    <div>{errorMsg}</div>
  );
}
