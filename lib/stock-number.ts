const STOCK_PREFIX = "st_";

export function formatStockNumber(vehicleId: number) {
  return `${STOCK_PREFIX}${vehicleId}`;
}

export function normalizeStockNumberInput(value: string | null | undefined) {
  const stock = value?.trim().toLowerCase();
  if (!stock) return "";

  const numeric = stock.match(/^\d+$/);
  if (numeric) return formatStockNumber(Number(numeric[0]));

  const prefixed = stock.match(/^st[-_ ]?(\d+)$/);
  if (prefixed) return formatStockNumber(Number(prefixed[1]));

  return stock;
}
