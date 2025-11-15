import VehicleDetails from "@/components/VehicleDetails";
import { retrieve } from "@/utilities/api-client";

export const dynamic = 'force-dynamic'; // Force dynamic rendering at page level

export default async function Page() {
  const makeModelMapResponse = await retrieve("/vehicle/make-model-map", false);

  return (
    <>
      <VehicleDetails modelMakeMap={makeModelMapResponse.data} />
    </>
  );
}
