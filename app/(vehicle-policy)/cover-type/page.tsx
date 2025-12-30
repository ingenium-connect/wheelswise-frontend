import SelectCoverType from "@/components/cover-type/CoverType";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import { CoverTypesResponse } from "@/types/data";
import { axiosServer } from "@/utilities/axios-server";
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints";
import { isAxiosError } from "axios";

export const dynamic = "force-dynamic";

export default async function Page() {
  let response: CoverTypesResponse | undefined = undefined;
  let errorMsg: string = "Failed to load cover types.";

  try {
    const res = await axiosServer.get(
      `${COVER_TYPES_ENDPOINT}/?page=1&page_size=3`
    );
    response = res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err?.response?.status === 404) {
        errorMsg = "Page not found";
      }
    }
  }

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: true },
  ];

  return response ? (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">
            Choose a Payment Method
          </h2>
          <p className="text-muted-foreground mt-2">
            Select your most convenient payment method.
          </p>
        </div>
        <SelectCoverType data={response} />
      </section>
    </>
  ) : (
    <div>{errorMsg}</div>
  );
}
