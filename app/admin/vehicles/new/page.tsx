import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { VehicleCreateForm } from "@/components/admin/VehicleCreateForm";
import { createVehicleAction } from "./actions";
import { db } from "@/lib/db";
import { bodyTypes, makes, models, vehicles } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  let makeOptions: { id: number; name: string }[] = [];
  let modelOptions: { id: number; name: string; makeId: number }[] = [];
  let bodyTypeOptions: { id: number; name: string }[] = [];
  let nextStockNumber = "1";

  try {
    if (!db) throw new Error("no db");

    makeOptions = await db
      .select({ id: makes.id, name: makes.name })
      .from(makes)
      .orderBy(asc(makes.name));

    modelOptions = await db
      .select({ id: models.id, name: models.name, makeId: models.makeId })
      .from(models)
      .leftJoin(makes, eq(models.makeId, makes.id))
      .orderBy(asc(makes.name), asc(models.name));

    bodyTypeOptions = await db
      .select({ id: bodyTypes.id, name: bodyTypes.name })
      .from(bodyTypes)
      .orderBy(asc(bodyTypes.name));

    const [latestVehicle] = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .orderBy(desc(vehicles.id))
      .limit(1);

    nextStockNumber = String((latestVehicle?.id ?? 0) + 1);
  } catch {
    makeOptions = [];
    modelOptions = [];
    bodyTypeOptions = [];
    nextStockNumber = "1";
  }

  if (makeOptions.length === 0 || modelOptions.length === 0 || bodyTypeOptions.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Add vehicle</h1>
        <p className="mt-4 max-w-2xl text-[#6b7280]">
          Makes, models, and body types must exist before a vehicle can be added. Please seed the
          database or add those records first.
        </p>
        <Link href="/admin/vehicles" className="mt-6 inline-block text-[#0c47a5] hover:underline">
          Back to vehicles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Add vehicle</h1>
          <p className="mt-2 max-w-3xl text-[#6b7280]">
            Create a vehicle directly from the admin dashboard. Images are uploaded to Vercel Blob
            first, the returned Blob URLs are then written into the `vehicle_images` table when you
            save the form, and active vehicles will appear on the website automatically.
          </p>
        </div>
        <Link href="/admin/vehicles" className="text-sm font-semibold text-[#0c47a5] hover:underline">
          Back to vehicles
        </Link>
      </div>

      <VehicleCreateForm
        action={createVehicleAction}
        makes={makeOptions}
        models={modelOptions}
        bodyTypes={bodyTypeOptions}
        initialValues={{ stockNumber: nextStockNumber }}
      />
    </div>
  );
}
