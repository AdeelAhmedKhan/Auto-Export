export const priceFilterLinks = [
  { label: "Under $5k", href: "/price-under/5000" },
  { label: "$5k - $8k", href: "/by-price/5000/8000" },
  { label: "$8k - $12k", href: "/by-price/8000/12000" },
  { label: "$12k - $20k", href: "/by-price/12000/20000" },
  { label: "$20k - $30k", href: "/by-price/20000/30000" },
  { label: "Over $30k", href: "/price-over/30000" },
] as const;

export const quickFilterLinks = [
  { label: "Petrol", href: "/search?fuel=Petrol" },
  { label: "Diesel", href: "/search?fuel=Diesel" },
  { label: "Electric", href: "/search?fuel=Electric" },
  { label: "LHD", href: "/search?steering=LHD" },
  { label: "RHD", href: "/search?steering=RHD" },
  { label: "Manual", href: "/search?transmission=Manual" },
  { label: "Automatic", href: "/search?transmission=Automatic" },
] as const;
