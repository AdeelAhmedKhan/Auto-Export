import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "./actions";
import { DeleteTestimonialButton } from "./DeleteTestimonialButton";

export const dynamic = "force-dynamic";

const inputClassName =
  "w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#0c47a5]";
const labelClassName = "text-sm font-medium text-[#374151]";

export default async function AdminTestimonialsPage() {
  let rows: (typeof testimonials.$inferSelect)[] = [];
  try {
    if (!db) throw new Error("no db");
    rows = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Testimonials</h1>
      <p className="mt-2 text-[#6b7280]">
        Add, edit, and delete homepage testimonials.
      </p>

      <form
        action={createTestimonialAction}
        className="mt-8 rounded-xl border border-[#e0e0e0] bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Add testimonial</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className={labelClassName}>
            Name
            <input name="name" required className={`${inputClassName} mt-1`} />
          </label>
          <label className={labelClassName}>
            Location
            <input name="location" required className={`${inputClassName} mt-1`} />
          </label>
          <label className={labelClassName}>
            Vehicle
            <input name="vehicle" required className={`${inputClassName} mt-1`} />
          </label>
          <label className={labelClassName}>
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className={`${inputClassName} mt-1`}
            />
          </label>
          <label className={`${labelClassName} md:col-span-2`}>
            Quote
            <textarea
              name="quote"
              required
              rows={4}
              className={`${inputClassName} mt-1 resize-y`}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input name="isActive" type="checkbox" defaultChecked />
            Active
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[#0c47a5] px-4 py-2 font-semibold text-white hover:bg-[#0a3d91]"
          >
            Add testimonial
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {rows.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-xl border border-[#e0e0e0] bg-white p-5 shadow-sm"
          >
            <form action={updateTestimonialAction}>
              <input type="hidden" name="id" value={testimonial.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClassName}>
                  Name
                  <input
                    name="name"
                    required
                    defaultValue={testimonial.name}
                    className={`${inputClassName} mt-1`}
                  />
                </label>
                <label className={labelClassName}>
                  Location
                  <input
                    name="location"
                    required
                    defaultValue={testimonial.location}
                    className={`${inputClassName} mt-1`}
                  />
                </label>
                <label className={labelClassName}>
                  Vehicle
                  <input
                    name="vehicle"
                    required
                    defaultValue={testimonial.vehicle}
                    className={`${inputClassName} mt-1`}
                  />
                </label>
                <label className={labelClassName}>
                  Sort order
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={testimonial.sortOrder ?? 0}
                    className={`${inputClassName} mt-1`}
                  />
                </label>
                <label className={`${labelClassName} md:col-span-2`}>
                  Quote
                  <textarea
                    name="quote"
                    required
                    rows={4}
                    defaultValue={testimonial.quote}
                    className={`${inputClassName} mt-1 resize-y`}
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-[#374151]">
                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={testimonial.isActive ?? true}
                  />
                  Active
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0c47a5] px-4 py-2 font-semibold text-white hover:bg-[#0a3d91]"
                >
                  Save changes
                </button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteTestimonialButton id={testimonial.id} name={testimonial.name} />
            </div>
          </div>
        ))}
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-6 text-sm text-[#6b7280]">
            No testimonials have been added yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
