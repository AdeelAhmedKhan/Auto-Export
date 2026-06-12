import Image from "next/image";
import Link from "next/link";
import { listMakes, listBodyTypes } from "@/lib/queries/makes";

export const DEFAULT_HERO_IMAGE =
  "/hero-bg/hero-bg.jpg";

export async function HeroBanner({
  imageUrl,
  showBackground = true,
}: {
  imageUrl?: string | null;
  showBackground?: boolean;
}) {
  const bg = imageUrl || DEFAULT_HERO_IMAGE;
  const makes = await listMakes().catch(() => []);
  const bodyTypes = await listBodyTypes().catch(() => []);
  const quickLinks = [
    { href: "/all-new-arrival", label: "New arrivals" },
    { href: "/all-clearance", label: "Clearance deals" },
    { href: "/price-under/8000", label: "Under $8k" },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {showBackground ? (
        <Image
          src={bg}
          alt="Parked export vehicles at a shipping port"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "left center" }}
          sizes="100vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-white/54 via-white/18 to-black/8" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 text-[#111827] sm:py-5 lg:py-6">
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.9fr)] lg:gap-5">
          <div className="max-w-3xl self-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#334155] sm:text-[11px]">
              Global Inventory Search
            </p>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Export-quality vehicles worldwide
            </h1>
            <p className="mt-1.5 max-w-xl text-xs font-medium text-[#334155] sm:text-sm">
              Search live stock by make, body type, price, and more.
            </p>
            <div className="mt-2 hidden flex-wrap gap-2 sm:flex">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[#0f172a]/15 bg-white/55 px-3.5 py-1.5 text-xs font-semibold text-[#111827] shadow-sm backdrop-blur hover:bg-white/75 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <form
            action="/search"
            method="get"
            className="rounded-2xl bg-white/95 p-3 text-[#0a0a0a] shadow-xl backdrop-blur sm:p-4 lg:max-w-[660px] lg:justify-self-end"
          >
            <div className="mb-2.5 flex items-start justify-between gap-3 border-b border-[#e5e7eb] pb-2.5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                  Quick Vehicle Search
                </p>
                <p className="mt-0.5 text-[11px] text-[#475569] sm:text-xs">
                  Use a few filters and jump straight into matching stock.
                </p>
              </div>
              <Link href="/search" className="text-xs font-semibold text-[#0c47a5] hover:underline sm:text-sm">
                Browse all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <label className="text-xs font-medium sm:text-sm">
                Stock ID
                <input
                  type="text"
                  name="stock"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="e.g. st_11"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Make
                <input
                  type="text"
                  name="make_text"
                  list="make-options"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  placeholder="Type or choose a make"
                />
                <datalist id="make-options">
                  {makes.map((m) => (
                    <option key={m.id} value={m.name} />
                  ))}
                </datalist>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Body type
                <input
                  type="text"
                  name="body_type_text"
                  list="body-type-options"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  placeholder="Type or choose a body type"
                />
                <datalist id="body-type-options">
                  {bodyTypes.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                </datalist>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Transmission
                <input
                  type="text"
                  name="transmission_text"
                  list="transmission-options"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  placeholder="Type or choose a transmission"
                />
                <datalist id="transmission-options">
                  <option value="Automatic" />
                  <option value="Manual" />
                  <option value="Automanual" />
                </datalist>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Fuel
                <input
                  type="text"
                  name="fuel_text"
                  list="fuel-options"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  placeholder="Type or choose a fuel type"
                />
                <datalist id="fuel-options">
                  <option value="Petrol" />
                  <option value="Diesel" />
                  <option value="Electric" />
                  <option value="Hybrid" />
                </datalist>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Year from
                <input
                  type="number"
                  name="min_year"
                  min={1990}
                  max={2030}
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="e.g. 2018"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Year to
                <input
                  type="number"
                  name="max_year"
                  min={1990}
                  max={2030}
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="e.g. 2024"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Min price (USD)
                <input
                  type="number"
                  name="min_price"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="0"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Max price (USD)
                <input
                  type="number"
                  name="max_price"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="50000"
                />
              </label>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#0c47a5] px-5 py-2 text-center text-sm font-semibold text-white hover:bg-[#0a3d91]"
              >
                Search
              </button>
              <Link
                href="/search"
                className="min-h-[40px] rounded-lg border-2 border-[#0c47a5] px-4 py-2 text-center text-sm font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
              >
                View all used cars
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
