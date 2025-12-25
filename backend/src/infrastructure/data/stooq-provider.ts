import type { MarketDataProvider } from "../market-data-provider.js";
import type { TimeSeriesPoint } from "../../domain/metric.js";

const BASE_URL = "https://stooq.com/q/d/l";

export class StooqProvider implements MarketDataProvider {
  async getDailySeries(symbol: string): Promise<TimeSeriesPoint[]> {
    const url = new URL(BASE_URL);
    url.searchParams.set("s", normalizeSymbol(symbol));
    url.searchParams.set("i", "d");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }

    const csv = await response.text();
    return parseCsv(csv);
  }
}

function normalizeSymbol(symbol: string): string {
  const normalized = symbol.trim().toLowerCase();
  if (normalized.endsWith(".us")) {
    return normalized;
  }
  return `${normalized}.us`;
}

function parseCsv(csv: string): TimeSeriesPoint[] {
  const lines = csv.trim().split("\n");
  if (lines.length <= 1) {
    return [];
  }

  const points: TimeSeriesPoint[] = [];
  for (const line of lines.slice(1)) {
    const [date, open, high, low, close] = line.split(",");
    if (!date || !close) {
      continue;
    }
    const value = Number(close);
    if (Number.isNaN(value)) {
      continue;
    }
    points.push({ date, value });
  }
  return points;
}
