import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

export const defaultTestimonials = [
  {
    name: "Ahmed Saleh",
    location: "Suriname",
    quote:
      "The team handled my inquiry professionally from the first message. The vehicle details were clear, the inspection was honest, and shipment updates arrived on time.",
    vehicle: "Ford Ranger Wildtrak",
  },
  {
    name: "Grace Mwangi",
    location: "Grenada",
    quote:
      "I appreciated how transparent the process felt. 9 Yard Trading helped me choose the right unit, explained the paperwork, and delivered exactly what was promised.",
    vehicle: "Toyota Commuter",
  },
  {
    name: "Marcus Johnson",
    location: "Kenya",
    quote:
      "Professional service, fair pricing, and quick replies. The car arrived in very good condition and the export documents were prepared without delays.",
    vehicle: "Toyota Hilux Standard Cab",
  },
];

export async function getHomepageTestimonials() {
  if (!db) return defaultTestimonials;

  try {
    const rows = await db
      .select({
        name: testimonials.name,
        location: testimonials.location,
        quote: testimonials.quote,
        vehicle: testimonials.vehicle,
      })
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));

    return rows;
  } catch {
    return defaultTestimonials;
  }
}
