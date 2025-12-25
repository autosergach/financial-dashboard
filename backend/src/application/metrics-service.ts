import type { SummaryMetrics, TimeSeriesPoint, TopAsset } from "../domain/metric.js";
import type { MarketDataProvider } from "../infrastructure/market-data-provider.js";

export class MetricsService {
  constructor(private readonly provider: MarketDataProvider) {}

  async getSummary(symbol: string): Promise<SummaryMetrics> {
    const series = await this.provider.getDailySeries(symbol);
    if (series.length < 2) {
      throw new Error("Not enough data for summary");
    }

    const latest = series[series.length - 1];
    const prev = series[series.length - 2];
    const values = series.map((point) => point.value);
    const rangeHigh = Math.max(...values);
    const rangeLow = Math.min(...values);
    const changeAbs = latest.value - prev.value;
    const changePct = prev.value === 0 ? 0 : (changeAbs / prev.value) * 100;

    return {
      symbol: symbol.toUpperCase(),
      latest: round(latest.value),
      changeAbs: round(changeAbs),
      changePct: round(changePct),
      rangeHigh: round(rangeHigh),
      rangeLow: round(rangeLow)
    };
  }

  async getTimeSeries(symbol: string, points = 30): Promise<TimeSeriesPoint[]> {
    const series = await this.provider.getDailySeries(symbol);
    return series.slice(-points);
  }

  async getTopAssets(symbols: string[]): Promise<TopAsset[]> {
    const summaries = await Promise.all(
      symbols.map(async (symbol) => {
        const summary = await this.getSummary(symbol);
        return {
          symbol: summary.symbol,
          latest: summary.latest,
          changePct: summary.changePct
        };
      })
    );

    return summaries
      .sort((a, b) => b.changePct - a.changePct)
      .slice(0, 5);
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
