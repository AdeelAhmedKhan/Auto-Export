import { VehicleListingSection } from "@/components/search/VehicleListingSection";
import { getVehicleByStockNumber } from "@/lib/queries/vehicles";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const stockParam = Array.isArray(searchParams.stock) ? searchParams.stock[0] : searchParams.stock;
  const stock = stockParam?.trim();
  if (stock) {
    const vehicle = await getVehicleByStockNumber(stock);
    if (vehicle) redirect(`/car/${vehicle.id}`);
  }

  return (
    <VehicleListingSection
      title="Used vehicles"
      breadcrumb="Used cars"
      baseParams={{ vehicleCondition: "used" }}
      searchParams={searchParams}
    />
  );
}
