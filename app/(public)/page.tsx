import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { DEFAULT_HERO_IMAGE, HeroBanner } from "@/components/home/HeroBanner";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { InventorySidebar } from "@/components/vehicle/InventorySidebar";
import { ListingPagination } from "@/components/search/ListingPagination";
import { getVehicleSidebarData, searchVehicles } from "@/lib/queries/vehicles";
import {
  listMakes,
  listBodyTypes,
} from "@/lib/queries/makes";
import { priceFilterLinks } from "@/lib/inventory-links";
import Image from "next/image";

export const revalidate = 120;

const aboutFeatures = [
  {
    title: "World Wide Dealing",
    description: "Serving buyers across international markets with reliable export support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M4 7.5h16v10H4z" />
        <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
        <path d="M4 11h16" />
      </svg>
    ),
  },
  {
    title: "Trusted by Auto Buyers",
    description: "Built on confidence, transparency, and careful inspection of every booking.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M7 12l3 3 7-7" />
        <path d="M12 21l-7-4V7l7-4 7 4v10l-7 4z" />
      </svg>
    ),
  },
  {
    title: "Affordable Auto Prices",
    description: "Competitive pricing across quality export vehicles for different buyer needs.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M3 13l3-5h12l3 5" />
        <path d="M5 13v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        <circle cx="8" cy="17" r="1.5" />
        <circle cx="16" cy="17" r="1.5" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Ahmed Saleh",
    location: "Grenada, Kenya",
    quote:
      "The team handled my inquiry professionally from the first message. The vehicle details were clear, the inspection was honest, and shipment updates arrived on time.",
    vehicle: "Ford Ranger Wildtrak",
  },
  {
    name: "Grace Mwangi",
    location: "Grenada, Kenya",
    quote:
      "I appreciated how transparent the process felt. 9 Yard Trading helped me choose the right unit, explained the paperwork, and delivered exactly what was promised.",
    vehicle: "Toyota Commuter",
  },
  {
    name: "Marcus Johnson",
    location: "Grenada, Kenya",
    quote:
      "Professional service, fair pricing, and quick replies. The car arrived in very good condition and the export documents were prepared without delays.",
    vehicle: "Toyota Hilux Standard Cab",
  },
];

function HomeSidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-[#d7dfef] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="bg-[linear-gradient(135deg,#102a66_0%,#0c47a5_100%)] px-3 py-2.5 sm:px-4 sm:py-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white sm:text-sm">{title}</h2>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

function HomeMiniVehicleCard({
  vehicle,
  badge,
}: {
  vehicle: Awaited<ReturnType<typeof searchVehicles>>["rows"][number];
  badge: string;
}) {
  return (
    <Link
      href={`/car/${vehicle.id}`}
      className="block overflow-hidden rounded-lg border border-[#d8dee9] bg-white shadow-sm transition-colors hover:bg-[#f8fbff] xl:rounded-none xl:border-x-0 xl:border-t-0 xl:px-1 xl:py-3 xl:shadow-none xl:last:border-b-0"
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-[#e5e7eb] xl:aspect-[4/3] xl:border xl:border-[#d8dee9]">
        <Image
          src={vehicle.thumbnail || "/placeholder-car.svg"}
          alt={vehicle.title}
          fill
          className="object-cover"
          sizes="(max-width: 1279px) 50vw, 210px"
        />
      </div>
      <div className="min-w-0 p-2 xl:p-0 xl:pt-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#173574] sm:text-[10px]">
          {badge}
        </p>
        <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-[#111827] sm:text-sm sm:leading-5">
          {vehicle.title}
        </h3>
        <p className="mt-1 truncate text-[10px] text-[#64748b] sm:text-xs">
          {vehicle.year} {vehicle.transmission ? `| ${vehicle.transmission}` : ""}
        </p>
        <p className="mt-1 text-xs font-bold text-[#173574] sm:text-sm">
          ${Number(vehicle.price).toLocaleString("en-US")}
        </p>
      </div>
    </Link>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const stockPageParam = Array.isArray(searchParams?.stock_page)
    ? searchParams?.stock_page[0]
    : searchParams?.stock_page;
  const stockPage = Math.max(1, parseInt(stockPageParam ?? "1", 10) || 1);
  const stockPerPage = 30;
  let newArrivals: Awaited<ReturnType<typeof searchVehicles>>["rows"] = [];
  let newArrivalsTotal = 0;
  let makes: Awaited<ReturnType<typeof listMakes>> = [];
  let bodyTypes: Awaited<ReturnType<typeof listBodyTypes>> = [];
  let sidebarData: Awaited<ReturnType<typeof getVehicleSidebarData>> = {
    makes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: [],
    steering: [],
    stats: { total: 0, featured: 0, clearance: 0, newArrival: 0 },
    featuredVehicles: [],
    latestVehicles: [],
    clearanceVehicles: [],
  };
  let highlightedVehicles: Awaited<ReturnType<typeof searchVehicles>>["rows"] = [];
  try {
    const na = await searchVehicles({ page: stockPage, perPage: stockPerPage, sort: "created_desc" });
    newArrivals = na.rows;
    newArrivalsTotal = na.total;
    makes = await listMakes();
    bodyTypes = await listBodyTypes();
    sidebarData = await getVehicleSidebarData({}, { page: 1 });
    const featuredHighlightResult = await searchVehicles({
      page: 1,
      perPage: 7,
      sort: "created_desc",
    });
    highlightedVehicles = [
      ...sidebarData.featuredVehicles,
      ...featuredHighlightResult.rows.filter(
        (candidate) => !sidebarData.featuredVehicles.some((featured) => featured.id === candidate.id)
      ),
    ].slice(0, 7);
  } catch {
    /* no DB */
  }

  const heroBackgroundImage = DEFAULT_HERO_IMAGE;
  const stockTotalPages = Math.max(1, Math.ceil(newArrivalsTotal / stockPerPage));

  return (
    <>
      <div
        className="relative overflow-hidden bg-cover bg-left bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
          backgroundAttachment: "fixed",
        }}
      >
        <HeroBanner imageUrl={heroBackgroundImage} showBackground={false} />

        <section className="relative bg-[#0f172a]/52 py-6 text-white backdrop-blur-[1px] sm:py-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#0c47a5]/12 to-black/20" />
          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                  Featured Stock
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">Highlighted vehicles</h2>
              </div>
              <Link
                href="/search"
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-white hover:underline"
              >
                Browse all stock
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
              {highlightedVehicles.map((vehicle) => (
                <VehicleCard key={`highlighted-${vehicle.id}`} vehicle={vehicle} compact />
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#eef1f6] py-8 sm:py-10">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="grid gap-5 xl:grid-cols-[210px_minmax(0,1fr)_210px]">
            <aside className="order-1 hidden space-y-5 xl:col-span-1 xl:block xl:sticky xl:top-24 xl:self-start">
              <InventorySidebar
                stats={[
                  { href: "/search", label: "Total stock", value: sidebarData.stats.total },
                  { href: "/search?new=1", label: "New arrivals", value: sidebarData.stats.newArrival },
                  { href: "/all-clearance", label: "Clearance", value: sidebarData.stats.clearance },
                  { href: "/search", label: "Featured", value: sidebarData.stats.featured },
                ]}
                makes={sidebarData.makes}
                bodyTypes={sidebarData.bodyTypes}
                fuelTypes={sidebarData.fuelTypes}
                transmissions={sidebarData.transmissions}
                steering={sidebarData.steering}
                makeHref={(item) => `/brand/${item.slug}`}
                bodyTypeHref={(item) => `/car-type/${item.slug}`}
                fuelHref={(item) => `/search?fuel=${item.label}`}
                transmissionHref={(item) => `/search?transmission=${item.label}`}
                steeringHref={(item) => `/search?steering=${item.label}`}
              />
            </aside>

            <main className="order-2 min-w-0 lg:order-2 xl:order-2">
              <section className="overflow-hidden rounded-[1.75rem] border border-[#d8dee9] bg-white">
                <div className="border-b border-[#d8dee9] bg-[linear-gradient(90deg,#102a66_0%,#173574_55%,#2f5eb8_100%)] px-4 py-5 text-white sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">
                        Inventory Center
                      </p>
                      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Latest Vehicle Listings</h2>
                      <p className="mt-2 max-w-2xl text-sm text-white/82">
                        Real inventory, real counts, and direct links into your live stock.
                        This section is now built as a proper marketplace board instead of a simple card strip.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                      <div className="flex min-h-[92px] flex-col justify-between border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Makes
                        </p>
                        <p className="text-2xl font-bold leading-none">{makes.length}</p>
                      </div>
                      <div className="flex min-h-[92px] flex-col justify-between border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Body types
                        </p>
                        <p className="text-2xl font-bold leading-none">{bodyTypes.length}</p>
                      </div>
                      <div className="flex min-h-[92px] flex-col justify-between border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Fresh units
                        </p>
                        <p className="text-2xl font-bold leading-none">{newArrivalsTotal}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#d8dee9] bg-[#f3f7ff] px-4 py-4 xl:hidden sm:px-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                    Quick Browse
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Link
                      href="/search"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      Browse all stock
                    </Link>
                    <Link
                      href="/all-new-arrival"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      New arrivals
                    </Link>
                    <Link
                      href="/all-clearance"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      Clearance deals
                    </Link>
                  </div>
                </div>

                <div className="border-b border-[#d8dee9] bg-[#f8fafc] px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {priceFilterLinks.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="rounded-xl border border-[#d8dee9] bg-white px-3 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff] sm:px-4"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div id="current-stock" className="scroll-mt-24 px-4 py-5 sm:px-6 sm:py-6">
                  <div className="mb-5 flex flex-col gap-3 border-b border-[#e5e7eb] pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                        New Arrivals Grid
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#111827] sm:text-2xl">Current Stock Feed</h3>
                    </div>
                    <Link
                      href="/all-new-arrival"
                      className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#173574] hover:underline"
                    >
                      View full inventory
                    </Link>
                  </div>
                  <VehicleGrid vehicles={newArrivals} />
                  <Suspense>
                    <ListingPagination
                      page={stockPage}
                      totalPages={stockTotalPages}
                      pageParam="stock_page"
                      hash="current-stock"
                    />
                  </Suspense>
                </div>
              </section>
            </main>

            <aside className="order-3 space-y-5 lg:order-3 lg:sticky lg:top-24 lg:self-start xl:order-3">
              <HomeSidebarSection title="Fresh Arrivals">
                <div className="grid grid-cols-2 gap-2 xl:block">
                  {sidebarData.latestVehicles.map((vehicle) => (
                    <HomeMiniVehicleCard key={`latest-${vehicle.id}`} vehicle={vehicle} badge="New" />
                  ))}
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Clearance Stock">
                <div className="grid grid-cols-2 gap-2 xl:block">
                  {(sidebarData.clearanceVehicles.length
                    ? sidebarData.clearanceVehicles
                    : sidebarData.latestVehicles
                  ).map((vehicle) => (
                    <HomeMiniVehicleCard
                      key={`clearance-${vehicle.id}`}
                      vehicle={vehicle}
                      badge="Clearance"
                    />
                  ))}
                </div>
              </HomeSidebarSection>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="overflow-hidden rounded-[1.75rem] border border-[#d9e0ef] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:rounded-[2rem]">
          <div className="bg-[linear-gradient(135deg,#0c47a5_0%,#18367c_55%,#101828_100%)] px-5 py-7 text-white sm:px-10 sm:py-8 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  About 9 Yard Trading
                </div>
                <h2 className="text-2xl font-bold leading-tight sm:text-4xl">
                  We are a Trusted Name in Auto Industry
                </h2>
                <p className="mt-3 text-base text-white/85 sm:text-2xl">
                  Visited by Million of Car Buyers Every Month!
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">Since 2019</p>
                  <p className="mt-1 text-sm text-white/80">Exporting vehicles with care</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">120+</p>
                  <p className="mt-1 text-sm text-white/80">Countries reached</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="mt-1 text-sm text-white/80">Units sold</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-5 py-7 sm:px-10 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-12">
            <div>
              <p className="max-w-2xl text-sm leading-7 text-[#52525b] sm:text-base sm:leading-8">
                9 Yard Trading is a leading and the most trusted name in the field of
                automobile trading industry.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#52525b] sm:mt-5 sm:text-base sm:leading-8">
                We are best known for providing quality vehicle inspection via thorough
                examination of every vehicle that is booked from our end.
              </p>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
                {aboutFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-[#dbe3f2] bg-[#f8fbff] p-5 shadow-sm"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0c47a5]/10 text-[#0c47a5]">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#0a0a0a]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] lg:grid-cols-1">
              <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-[#e8eef9] shadow-lg sm:min-h-[260px] sm:rounded-[1.75rem]">
                <Image
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"
                  alt="9 Yard Trading vehicle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[#0f172a]/88 p-4 shadow-xl backdrop-blur sm:bottom-5 sm:left-5 sm:right-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#93c5fd]">
                    Quality Promise
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white">
                    Every vehicle is carefully reviewed so buyers get dependable details
                    and a smoother export experience.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#fff9ec] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6700]">
                    Inspection
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0a0a0a]">
                    Thorough vehicle examination before every booking.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f4f7ff] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0c47a5]">
                    Reliability
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0a0a0a]">
                    Trusted service from inquiry through export delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#173574_48%,#0c47a5_100%)] px-4 py-7 text-white sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#bfdbfe]">
                Client Testimonials
              </p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-3xl">
                Trusted by buyers around the world
              </h2>
              <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-white/72 sm:block">
                Real confidence comes from clear communication, dependable vehicle details,
                and export support that stays responsive from inquiry to shipment.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/20 bg-white px-5 text-sm font-semibold text-[#173574] shadow-sm transition-colors hover:bg-[#eef4ff]"
            >
              Share your inquiry
            </Link>
          </div>

          <div className="snap-x snap-mandatory overflow-x-auto pb-3">
            <div className="grid auto-cols-[86%] grid-flow-col gap-4 sm:auto-cols-[48%] lg:auto-cols-[32%]">
            {testimonials.map((testimonial) => (
              <article
                key={`${testimonial.name}-${testimonial.location}`}
                className="flex min-h-[210px] snap-start scroll-ml-4 flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur sm:min-h-[245px] sm:p-5"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
                    <div className="flex gap-1 text-[#f5b301]" aria-label="5 star review">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        >
                          <path d="M10 1.6l2.55 5.17 5.7.83-4.12 4.02.97 5.68L10 14.62 4.9 17.3l.97-5.68L1.75 7.6l5.7-.83L10 1.6z" />
                        </svg>
                      ))}
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#dbeafe] sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                      Verified
                    </span>
                  </div>
                  <p className="line-clamp-4 text-sm leading-6 text-white/88 sm:text-sm sm:leading-7">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 border-t border-white/15 pt-4 sm:mt-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white text-sm font-bold text-[#173574] sm:h-12 sm:w-12 sm:text-base">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white sm:text-base">{testimonial.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-white/62 sm:text-sm">{testimonial.location}</p>
                      <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[#bfdbfe] sm:text-xs sm:tracking-[0.16em]">
                        {testimonial.vehicle}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </div>

          <div className="mt-1 flex justify-center gap-2">
            {testimonials.map((testimonial) => (
              <span
                key={`testimonial-dot-${testimonial.name}`}
                className="h-1.5 w-8 rounded-full bg-white/35"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
