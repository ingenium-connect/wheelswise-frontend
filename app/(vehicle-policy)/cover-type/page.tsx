import SelectCoverType from "@/components/cover-type/CoverType";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import { CoverTypesResponse } from "@/types/data";
import { retrieve } from "@/utilities/api-client";
import { COVER_TYPES_ENDPOINT } from "@/utilities/endpoints";

export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await retrieve<CoverTypesResponse>(
    `${COVER_TYPES_ENDPOINT}?page=1&page_size=3`,
    false
  );

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: true },
  ];

  if (response.error || !response.data) {
    return <div>Failed to load cover types.</div>;
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">
            Choose Your Cover
          </h2>
          <p className="text-muted-foreground mt-2">
            Select the motor insurance plan that best fits your needs.
          </p>
        </div>
        <SelectCoverType data={response.data} />
      </section>
    </>
  );
}
