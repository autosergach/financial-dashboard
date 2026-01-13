import type { MarketDataProvider } from "../market-data-provider.js";
import type { TimeSeriesPoint } from "../../domain/metric.js";

export class MockMarketDataProvider implements MarketDataProvider {
  async getDailySeries(symbol: string): Promise<TimeSeriesPoint[]> {
    const seed = symbol.toLowerCase().charCodeAt(0) || 65;
    const points: TimeSeriesPoint[] = [];
    const base = 120 + (seed % 10) * 3;
    for (let i = 0; i < 30; i += 1) {
      const value = base + Math.sin(i / 4) * 4 + i * 0.12;
      const day = String(i + 1).padStart(2, "0");
      points.push({ date: `2024-02-${day}`, value: round(value) });
    }
    return points;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
