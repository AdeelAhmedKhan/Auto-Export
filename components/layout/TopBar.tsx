"use client";

import { useEffect, useState } from "react";
import { SITE_CONTACT, phoneHref } from "@/lib/site-contact";

type TopBarProps = {
  hours?: string;
  phone?: string;
  email?: string;
};

const securityHeadline =
  "Beware of scam websites. For your safety, please ensure all payments are made only to our official bank account under the name: 9 Yard Tarding Company Limited";

function formatThailandTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const second = parts.find((part) => part.type === "second")?.value ?? "00";
  const dayPeriod =
    (parts.find((part) => part.type === "dayPeriod")?.value ?? "AM").toLowerCase();

  return `${hour}:${minute}:${second}${dayPeriod}`;
}

export function TopBar({
  hours = SITE_CONTACT.hours,
  email = SITE_CONTACT.email,
}: TopBarProps) {
  const [thaiTime, setThaiTime] = useState(() => formatThailandTime(new Date()));
  const [mounted, setMounted] = useState(false);
  const primaryPhone = SITE_CONTACT.phone;
  const secondaryPhone = SITE_CONTACT.secondaryPhone;

  useEffect(() => {
    setMounted(true);
    const tick = () => setThaiTime(formatThailandTime(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-sm text-white">
      <div className="overflow-hidden border-b border-black/10 bg-[#facc15] text-[11px] font-bold uppercase tracking-[0.14em] text-[#111827]">
        <div className="marquee-shell py-2">
          <div className="marquee-track">
            <span className="mx-8 inline-block whitespace-nowrap">{securityHeadline}</span>
            <span className="mx-8 inline-block whitespace-nowrap">{securityHeadline}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2 md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span
            className="rounded-full border border-white/10 bg-[#4c0fb8] px-3 py-1 font-semibold text-white"
            suppressHydrationWarning
          >
            Time: {mounted ? thaiTime : "--:--:--"}
          </span>
          <span className="text-white/85">{hours}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a href={phoneHref(primaryPhone)} className="font-medium text-[#e6d53c] hover:underline">
              {primaryPhone}
            </a>
            <a href={phoneHref(secondaryPhone)} className="font-medium text-[#e6d53c] hover:underline">
              {secondaryPhone}
            </a>
          </div>
          <a href={`mailto:${email}`} className="font-medium text-[#e6d53c] hover:underline">
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
