"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { inquiries, vehicles } from "@/lib/db/schema";

const deleteVehicleSchema = z.object({
  vehicleId: z.coerce.number().int().positive(),
});

export async function deleteVehicleAction(formData: FormData) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const parsed = deleteVehicleSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
  });

  if (!parsed.success) {
    throw new Error("Vehicle was not found.");
  }

  const vehicleId = parsed.data.vehicleId;

  await db.transaction(async (tx) => {
    await tx
      .update(inquiries)
      .set({ vehicleId: null })
      .where(eq(inquiries.vehicleId, vehicleId));

    await tx.delete(vehicles).where(eq(vehicles.id, vehicleId));
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/car/${vehicleId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
