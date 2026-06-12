"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

const testimonialFields = {
  name: z.string().trim().min(1, "Name is required.").max(255),
  location: z.string().trim().min(1, "Location is required.").max(255),
  vehicle: z.string().trim().min(1, "Vehicle is required.").max(255),
  quote: z.string().trim().min(1, "Quote is required."),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(false),
};

const createTestimonialSchema = z.object(testimonialFields);

const updateTestimonialSchema = z.object({
  id: z.coerce.number().int().positive(),
  ...testimonialFields,
});

const deleteTestimonialSchema = z.object({
  id: z.coerce.number().int().positive(),
});

function parseActive(formData: FormData) {
  return formData.get("isActive") === "on";
}

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonialAction(formData: FormData) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const parsed = createTestimonialSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    vehicle: formData.get("vehicle"),
    quote: formData.get("quote"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseActive(formData),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid testimonial.");
  }

  await db.insert(testimonials).values(parsed.data);
  revalidateTestimonials();
}

export async function updateTestimonialAction(formData: FormData) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const parsed = updateTestimonialSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    location: formData.get("location"),
    vehicle: formData.get("vehicle"),
    quote: formData.get("quote"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseActive(formData),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid testimonial.");
  }

  const { id, ...values } = parsed.data;
  await db
    .update(testimonials)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(testimonials.id, id));
  revalidateTestimonials();
}

export async function deleteTestimonialAction(formData: FormData) {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const parsed = deleteTestimonialSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    throw new Error("Testimonial was not found.");
  }

  await db.delete(testimonials).where(eq(testimonials.id, parsed.data.id));
  revalidateTestimonials();
}
