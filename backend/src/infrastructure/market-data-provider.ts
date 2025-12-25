import type { TimeSeriesPoint } from "../domain/metric.js";

export type MarketDataProvider = {
  getDailySeries(symbol: string): Promise<TimeSeriesPoint[]>;
};
