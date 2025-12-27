import type { MarketDataProvider } from "./market-data-provider.js";
import type { TimeSeriesPoint } from "../domain/metric.js";

type CacheEntry = {
  series: TimeSeriesPoint[];
  expiresAt: number;
};

export class CachedMarketDataProvider implements MarketDataProvider {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly provider: MarketDataProvider,
    private readonly ttlMs: number
  ) {}

  async getDailySeries(symbol: string): Promise<TimeSeriesPoint[]> {
    const key = symbol.toLowerCase();
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > now) {
      return cached.series;
    }

    const series = await this.provider.getDailySeries(symbol);
    this.cache.set(key, { series, expiresAt: now + this.ttlMs });
    return series;
  }
}
