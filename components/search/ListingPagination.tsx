"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ListingPagination({
  page,
  totalPages,
  pageParam = "page",
  className = "mt-10 justify-center",
  hash,
}: {
  page: number;
  totalPages: number;
  pageParam?: string;
  className?: string;
  hash?: string;
}) {
  const sp = useSearchParams();
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const href = (p: number) => {
    const next = new URLSearchParams(sp.toString());
    if (p <= 1) {
      next.delete(pageParam);
    } else {
      next.set(pageParam, String(p));
    }
    const query = next.toString();
    const suffix = hash ? `#${hash.replace(/^#/, "")}` : "";
    return `${query ? `?${query}` : "?"}${suffix}`;
  };

  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => start + index
  );

  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Vehicle pagination">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="rounded-lg border border-[#e0e0e0] px-4 py-2 text-sm hover:bg-[#f5f5f5]"
        >
          Previous
        </Link>
      ) : null}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`min-w-10 rounded-lg border px-3 py-2 text-center text-sm font-semibold ${
            p === currentPage
              ? "border-[#0c47a5] bg-[#0c47a5] text-white"
              : "border-[#e0e0e0] text-[#111827] hover:bg-[#f5f5f5]"
          }`}
        >
          {p}
        </Link>
      ))}
      <span className="px-2 text-sm text-[#6b7280]">
        of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="rounded-lg border border-[#e0e0e0] px-4 py-2 text-sm hover:bg-[#f5f5f5]"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
