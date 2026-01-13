import type { MarketDataProvider } from "./market-data-provider.js";
import type { TimeSeriesPoint } from "../domain/metric.js";

export class FallbackMarketDataProvider implements MarketDataProvider {
  constructor(
    private readonly primary: MarketDataProvider,
    private readonly fallback: MarketDataProvider
  ) {}

  async getDailySeries(symbol: string): Promise<TimeSeriesPoint[]> {
    try {
      return await this.primary.getDailySeries(symbol);
    } catch {
      return this.fallback.getDailySeries(symbol);
    }
  }
}
