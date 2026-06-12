import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { normalizeSteeringFilter } from "@/lib/listing-params";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
import type { SidebarFacetItem } from "@/lib/queries/vehicles";

const pinnedQuickFilterLabels = new Set([
  "Petrol",
  "Diesel",
  "Electric",
  "LHD",
  "RHD",
  "Manual",
  "Automatic",
]);

function BrandLogoMark({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const shortLabel = normalized.includes("mitsubishi")
    ? "MITSUBISHI"
    : normalized.includes("mercedes")
      ? "MERCEDES"
      : label.toUpperCase();

  if (normalized.includes("toyota")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <ellipse cx="60" cy="25" rx="34" ry="17" fill="none" stroke="#0c47a5" strokeWidth="5" />
        <ellipse cx="60" cy="25" rx="13" ry="20" fill="none" stroke="#0c47a5" strokeWidth="4" />
        <path d="M29 25h62" stroke="#0c47a5" strokeWidth="4" />
        <text x="60" y="53" textAnchor="middle" className="fill-[#173574] text-[13px] font-black tracking-[0.18em]">
          TOYOTA
        </text>
      </svg>
    );
  }

  if (normalized.includes("ford")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <ellipse cx="60" cy="25" rx="42" ry="18" fill="#173574" />
        <ellipse cx="60" cy="25" rx="38" ry="15" fill="none" stroke="#dbeafe" strokeWidth="2" />
        <text x="60" y="31" textAnchor="middle" className="fill-white text-[18px] font-black italic">
          Ford
        </text>
      </svg>
    );
  }

  if (normalized.includes("honda")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <rect x="38" y="8" width="44" height="36" rx="8" fill="none" stroke="#0c47a5" strokeWidth="5" />
        <path d="M48 12v28M72 12v28M48 28h24" stroke="#0c47a5" strokeWidth="5" strokeLinecap="round" />
        <text x="60" y="56" textAnchor="middle" className="fill-[#173574] text-[12px] font-black tracking-[0.22em]">
          HONDA
        </text>
      </svg>
    );
  }

  if (normalized.includes("nissan")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="25" r="22" fill="none" stroke="#0c47a5" strokeWidth="5" />
        <rect x="28" y="18" width="64" height="14" rx="3" fill="#173574" />
        <text x="60" y="29" textAnchor="middle" className="fill-white text-[11px] font-black tracking-[0.14em]">
          NISSAN
        </text>
      </svg>
    );
  }

  if (normalized.includes("bmw")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="25" r="25" fill="#173574" />
        <path d="M60 25V4A21 21 0 0 1 81 25Z" fill="#bfdbfe" />
        <path d="M60 25v21A21 21 0 0 1 39 25Z" fill="#bfdbfe" />
        <circle cx="60" cy="25" r="25" fill="none" stroke="#0f172a" strokeWidth="3" />
        <text x="60" y="55" textAnchor="middle" className="fill-[#173574] text-[12px] font-black tracking-[0.28em]">
          BMW
        </text>
      </svg>
    );
  }

  if (normalized.includes("mazda")) {
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <ellipse cx="60" cy="24" rx="30" ry="20" fill="none" stroke="#0c47a5" strokeWidth="5" />
        <path d="M34 19c13 3 19 10 26 22 7-12 13-19 26-22-11 2-19-1-26-8-7 7-15 10-26 8Z" fill="#0c47a5" />
        <text x="60" y="56" textAnchor="middle" className="fill-[#173574] text-[12px] font-black tracking-[0.2em]">
          MAZDA
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
      <rect x="18" y="10" width="84" height="34" rx="17" fill="#eef4ff" stroke="#bfdbfe" strokeWidth="3" />
      <text x="60" y="32" textAnchor="middle" className="fill-[#0c47a5] text-[13px] font-black tracking-[0.12em]">
        {shortLabel.slice(0, 10)}
      </text>
    </svg>
  );
}

function SidebarPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#cfd9ea] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="bg-[linear-gradient(135deg,#0f172a_0%,#173574_58%,#0c47a5_100%)] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white text-xs font-black text-[#0c47a5] shadow-sm">
            9Y
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold uppercase tracking-[0.16em] text-white">
              {title}
            </h2>
            {subtitle ? <p className="mt-0.5 truncate text-[11px] text-white/70">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">{children}</div>
    </section>
  );
}

export function SidebarStatCard({
  href,
  label,
  value,
  active,
}: {
  href: string;
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl border px-3 py-3 transition-colors",
        active
          ? "border-[#0c47a5] bg-[#eef5ff] shadow-sm"
          : "border-[#dbe3f2] bg-white hover:border-[#0c47a5] hover:bg-[#f8fbff]"
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#111827]">{value}</p>
    </Link>
  );
}

function BodyTypeIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const iconClass = "h-7 w-14";

  if (normalized.includes("wagon") || normalized.includes("van")) {
    return (
      <svg viewBox="0 0 86 36" fill="none" stroke="currentColor" strokeWidth="3" className={iconClass}>
        <path d="M7 23h5l6-11h38l12 11h10" />
        <path d="M20 12h21v11H12" />
        <path d="M41 12h15l12 11H41z" />
        <circle cx="24" cy="26" r="5" />
        <circle cx="64" cy="26" r="5" />
      </svg>
    );
  }

  if (normalized.includes("suv") || normalized.includes("jeep")) {
    return (
      <svg viewBox="0 0 86 36" fill="none" stroke="currentColor" strokeWidth="3" className={iconClass}>
        <path d="M6 23h7l7-12h40l13 12h7" />
        <path d="M20 11h18v12H13" />
        <path d="M38 11h21l14 12H38z" />
        <path d="M18 18h48" />
        <circle cx="25" cy="27" r="5" />
        <circle cx="64" cy="27" r="5" />
      </svg>
    );
  }

  if (normalized.includes("sport") || normalized.includes("coupe")) {
    return (
      <svg viewBox="0 0 86 36" fill="none" stroke="currentColor" strokeWidth="3" className={iconClass}>
        <path d="M7 24h8l9-8c5-5 25-6 35-1l9 9h11" />
        <path d="M27 16h25l9 8H17z" />
        <circle cx="25" cy="27" r="4.5" />
        <circle cx="62" cy="27" r="4.5" />
      </svg>
    );
  }

  if (normalized.includes("truck") || normalized.includes("pickup")) {
    return (
      <svg viewBox="0 0 86 36" fill="none" stroke="currentColor" strokeWidth="3" className={iconClass}>
        <path d="M7 24h8V12h31v12h7l6-9h15v9h6" />
        <path d="M46 15h13" />
        <circle cx="24" cy="27" r="5" />
        <circle cx="64" cy="27" r="5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 86 36" fill="none" stroke="currentColor" strokeWidth="3" className={iconClass}>
      <path d="M7 24h8l8-10h34l10 10h12" />
      <path d="M24 14h30l8 10H16z" />
      <path d="M31 14v10" />
      <path d="M52 14v10" />
      <circle cx="25" cy="27" r="5" />
      <circle cx="62" cy="27" r="5" />
    </svg>
  );
}

function BrandBadgeGrid({
  items,
  activeMakeId,
  makeHref,
}: {
  items: SidebarFacetItem[];
  activeMakeId?: number | null;
  makeHref: (item: SidebarFacetItem) => string;
}) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.slice(0, 8).map((item) => (
        <Link
          key={`make-${item.id}`}
          href={makeHref(item)}
          className={cn(
            "group flex min-h-[92px] min-w-0 flex-col items-center justify-center rounded-xl border bg-white px-2 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0c47a5] hover:bg-[#f8fbff] hover:shadow-md",
            activeMakeId === Number(item.id)
              ? "border-[#0c47a5] ring-2 ring-[#0c47a5]/15"
              : "border-[#dbe3f2]"
          )}
        >
          <span className="flex h-14 w-full items-center justify-center overflow-hidden rounded-lg bg-white px-1.5">
            <BrandLogoMark label={item.label} />
          </span>
          <span className="mt-2 max-w-full truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#111827]">
            {item.label}
          </span>
          <span className="mt-1 rounded-full bg-[#eef4ff] px-2 py-0.5 text-[10px] font-semibold text-[#0c47a5]">
            {item.count} cars
          </span>
        </Link>
      ))}
    </div>
  );
}

function BodyTypeBadgeGrid({
  items,
  activeBodyTypeId,
  bodyTypeHref,
}: {
  items: SidebarFacetItem[];
  activeBodyTypeId?: number | null;
  bodyTypeHref: (item: SidebarFacetItem) => string;
}) {
  if (!items.length) return null;

  return (
    <div className="grid gap-2">
      {items.slice(0, 8).map((item) => (
        <Link
          key={`body-${item.id}`}
          href={bodyTypeHref(item)}
          className={cn(
            "group flex min-w-0 items-center gap-2.5 rounded-xl border bg-white px-2.5 py-3 text-[#111827] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0c47a5] hover:bg-[#f8fbff] hover:shadow-md",
            activeBodyTypeId === Number(item.id)
              ? "border-[#0c47a5] ring-2 ring-[#0c47a5]/15"
              : "border-[#dbe3f2]"
          )}
        >
          <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg border border-[#dbeafe] bg-[#eef4ff] text-[#0c47a5]">
            <BodyTypeIcon label={item.label} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{item.label}</span>
            <span className="mt-0.5 block text-xs text-[#64748b]">{item.count} cars</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function CompactFilterList({
  title,
  items,
  activeValue,
  buildHref,
}: {
  title: string;
  items: SidebarFacetItem[];
  activeValue?: string | number | null;
  buildHref: (item: SidebarFacetItem) => string;
}) {
  if (!items.length) return null;

  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={`${title}-${item.id}`}
            href={buildHref(item)}
            className={cn(
              "flex items-center justify-between border px-3 py-2 text-sm transition-colors",
              activeValue === item.id || activeValue === item.label
                ? "border-[#0c47a5] bg-[#eef5ff] text-[#0c47a5]"
                : "border-[#e2e8f0] bg-white text-[#111827] hover:border-[#0c47a5]"
            )}
          >
            <span className="truncate font-medium">{item.label}</span>
            <span className="ml-3 bg-[#f1f5f9] px-2 py-0.5 text-xs text-[#475569]">
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SimpleLinkGrid({
  items,
  activeHref,
}: {
  items: readonly { label: string; href: string }[];
  activeHref?: string;
}) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "border px-3 py-2 text-sm font-medium transition-colors",
            activeHref === item.href
              ? "border-[#0c47a5] bg-[#eef5ff] text-[#0c47a5]"
              : "border-[#d8dee9] bg-white text-[#111827] hover:border-[#173574] hover:bg-[#eef4ff] hover:text-[#173574]"
          )}
        >
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-[#0c47a5]" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function facetHasValue(items: SidebarFacetItem[], value: string) {
  const normalizedValue = value.trim().toLowerCase();
  return items.some((item) => {
    const candidates = [String(item.id), item.label].map((candidate) => candidate.trim().toLowerCase());
    return candidates.includes(normalizedValue);
  });
}

function quickFilterHasInventory(
  href: string,
  facets: {
    fuelTypes: SidebarFacetItem[];
    transmissions: SidebarFacetItem[];
    steering: SidebarFacetItem[];
  }
) {
  const params = new URLSearchParams(href.split("?")[1] ?? "");
  const fuel = params.get("fuel");
  const transmission = params.get("transmission");
  const steering = normalizeSteeringFilter(params.get("steering"));

  if (fuel) return facetHasValue(facets.fuelTypes, fuel);
  if (transmission) return facetHasValue(facets.transmissions, transmission);
  if (steering) {
    return facets.steering.some((item) => normalizeSteeringFilter(String(item.id)) === steering);
  }

  return true;
}

type InventorySidebarProps = {
  stats?: Array<{ href: string; label: string; value: number; active?: boolean }>;
  resetHref?: string;
  makes: SidebarFacetItem[];
  bodyTypes: SidebarFacetItem[];
  fuelTypes?: SidebarFacetItem[];
  transmissions?: SidebarFacetItem[];
  steering?: SidebarFacetItem[];
  makeHref: (item: SidebarFacetItem) => string;
  bodyTypeHref: (item: SidebarFacetItem) => string;
  fuelHref?: (item: SidebarFacetItem) => string;
  transmissionHref?: (item: SidebarFacetItem) => string;
  steeringHref?: (item: SidebarFacetItem) => string;
  activeMakeId?: number | null;
  activeBodyTypeId?: number | null;
  activeFuel?: string | null;
  activeTransmission?: string | null;
  activeSteering?: string | null;
  activeQuickHref?: string;
  activePriceHref?: string;
  showSpecs?: boolean;
  className?: string;
};

export function InventorySidebar({
  stats = [],
  resetHref,
  makes,
  bodyTypes,
  fuelTypes = [],
  transmissions = [],
  steering = [],
  makeHref,
  bodyTypeHref,
  fuelHref,
  transmissionHref,
  steeringHref,
  activeMakeId,
  activeBodyTypeId,
  activeFuel,
  activeTransmission,
  activeSteering,
  activeQuickHref,
  activePriceHref,
  showSpecs = false,
  className,
}: InventorySidebarProps) {
  const visibleQuickFilterLinks = quickFilterLinks.filter((item) =>
    pinnedQuickFilterLabels.has(item.label) ||
    quickFilterHasInventory(item.href, { fuelTypes, transmissions, steering })
  );

  return (
    <aside className={cn("space-y-6", className)}>
      {stats.length ? (
        <SidebarPanel title="Inventory" subtitle="Live stock overview">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {stats.map((stat) => (
              <SidebarStatCard
                key={`${stat.label}-${stat.href}`}
                href={stat.href}
                label={stat.label}
                value={stat.value}
                active={stat.active}
              />
            ))}
          </div>
          {resetHref ? (
            <Link
              href={resetHref}
              className="mt-4 inline-flex text-sm font-semibold text-[#0c47a5] hover:underline"
            >
              Reset filters
            </Link>
          ) : null}
        </SidebarPanel>
      ) : null}

      <SidebarPanel title="Browse Makes" subtitle="Popular brands">
        <BrandBadgeGrid items={makes} activeMakeId={activeMakeId} makeHref={makeHref} />
      </SidebarPanel>

      <SidebarPanel title="Car Body" subtitle="Browse by shape">
        <BodyTypeBadgeGrid
          items={bodyTypes}
          activeBodyTypeId={activeBodyTypeId}
          bodyTypeHref={bodyTypeHref}
        />
      </SidebarPanel>

      <SidebarPanel title="Price Range" subtitle="Budget shortcuts">
        <SimpleLinkGrid items={priceFilterLinks} activeHref={activePriceHref} />
      </SidebarPanel>

      <SidebarPanel title="Quick Filters" subtitle="Fast stock views">
        <SimpleLinkGrid items={visibleQuickFilterLinks} activeHref={activeQuickHref} />
      </SidebarPanel>

      {showSpecs && (fuelTypes.length || transmissions.length || steering.length) ? (
        <SidebarPanel title="Specifications" subtitle="Refine results">
          <div className="space-y-6">
            {fuelHref ? (
              <CompactFilterList
                title="Fuel type"
                items={fuelTypes}
                activeValue={activeFuel}
                buildHref={fuelHref}
              />
            ) : null}
            {transmissionHref ? (
              <CompactFilterList
                title="Transmission"
                items={transmissions}
                activeValue={activeTransmission}
                buildHref={transmissionHref}
              />
            ) : null}
            {steeringHref ? (
              <CompactFilterList
                title="Steering"
                items={steering}
                activeValue={activeSteering}
                buildHref={steeringHref}
              />
            ) : null}
          </div>
        </SidebarPanel>
      ) : null}
    </aside>
  );
}
