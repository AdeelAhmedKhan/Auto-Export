import Image from "next/image";
import Link from "next/link";
import type { VehicleListItem } from "@/types";
import { formatUsd } from "@/lib/utils";

type Props = {
  vehicle: VehicleListItem;
  compact?: boolean;
};

export function VehicleCard({ vehicle, compact = false }: Props) {
  const price = parseFloat(String(vehicle.price));
  const img = vehicle.thumbnail || "/placeholder-car.svg";
  const metaBadges = [
    vehicle.bodyTypeName,
    vehicle.transmission,
    vehicle.year ? String(vehicle.year) : null,
    vehicle.fuelType,
  ].filter(Boolean);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#dfe4ee] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_12px_22px_rgba(15,23,42,0.09)]">
      <Link
        href={`/car/${vehicle.id}`}
        className={`relative overflow-hidden bg-[#f5f5f5] ${compact ? "aspect-[6/4]" : "aspect-square"}`}
      >
        <Image
          src={img}
          alt={vehicle.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes={
            compact
              ? "(max-width:640px) 50vw, (max-width:1024px) 33vw, 14vw"
              : "(max-width:640px) 33vw, (max-width:1024px) 33vw, (max-width:1280px) 20vw, 20vw"
          }
        />
        {vehicle.isFeatured ? (
          <span className="absolute left-1 top-1 rounded bg-[#e6d53c] px-1.5 py-0.5 text-[9px] font-semibold text-black shadow-sm sm:left-1.5 sm:top-1.5 sm:text-[10px]">
            Featured
          </span>
        ) : null}
        {vehicle.isClearance ? (
          <span className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm sm:right-1.5 sm:top-1.5 sm:text-[10px]">
            Clearance
          </span>
        ) : null}
      </Link>
      <div
        className={`flex min-h-0 flex-1 flex-col ${
          compact ? "gap-1 p-1.5 sm:p-2" : "gap-1 p-1.5 sm:gap-1.5 sm:p-2.5"
        }`}
      >
        {vehicle.stockNumber ? (
          <p
            className={`font-mono font-bold uppercase tracking-[0.12em] text-[#64748b] ${
              compact ? "text-[0.52rem] sm:text-[0.58rem]" : "text-[0.58rem] sm:text-[0.66rem]"
            }`}
          >
            Stock {vehicle.stockNumber}
          </p>
        ) : null}
        <Link href={`/car/${vehicle.id}`} className="min-w-0">
          <h3
            className={`block min-h-[1rem] overflow-hidden text-ellipsis whitespace-nowrap font-semibold uppercase leading-none text-[#0a0a0a] sm:line-clamp-2 sm:whitespace-normal sm:leading-[1.15] ${
              compact ? "text-[0.64rem] sm:min-h-[1.55rem] sm:text-[0.68rem] xl:text-[0.72rem]" : "text-[0.68rem] sm:min-h-[2rem] sm:text-[0.82rem]"
            }`}
          >
            {vehicle.title}
          </h3>
        </Link>
        <p
          className={`font-bold leading-none text-[#0c47a5] ${
            compact ? "text-[0.68rem] sm:text-[0.76rem] xl:text-[0.8rem]" : "text-[0.72rem] sm:text-[0.9rem]"
          }`}
        >
          {formatUsd(price)}
        </p>
        {vehicle.mileage != null ? (
          <p className="hidden text-[11px] font-medium leading-4 text-[#64748b] sm:block">
            {vehicle.mileage.toLocaleString()} km
          </p>
        ) : (
          <div className="hidden h-[0.9rem] sm:block" />
        )}
        <div className="flex flex-wrap content-start gap-1 overflow-hidden sm:gap-1.5">
          {metaBadges.slice(0, 1).map((badge) => (
            <span
              key={badge}
              className="rounded bg-[#f5f5f5] px-1.5 py-1 text-[8px] leading-none text-[#6b7280] sm:px-2 sm:text-[10px]"
            >
              {badge}
            </span>
          ))}
          {metaBadges.slice(1, 2).map((badge) => (
            <span
              key={badge}
              className="hidden rounded bg-[#f5f5f5] px-2 py-1 text-[10px] leading-none text-[#6b7280] sm:inline-flex"
            >
              {badge}
            </span>
          ))}
        </div>
        <Link
          href={`/car/${vehicle.id}#quote`}
          className={`mt-auto inline-flex w-full items-center justify-center rounded-md bg-[#0c47a5] px-1.5 py-1.5 font-semibold text-white hover:bg-[#0a3d91] ${
            compact ? "text-[0.64rem] sm:px-2 sm:py-1.5 sm:text-[0.7rem] xl:text-[0.74rem]" : "text-[0.68rem] sm:px-3 sm:py-2 sm:text-[0.82rem]"
          }`}
        >
          Get Quote
        </Link>
      </div>
    </article>
  );
}
