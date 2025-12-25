import { MetricsService } from "../../src/application/metrics-service.js";
import type { MarketDataProvider } from "../../src/infrastructure/market-data-provider.js";

const provider: MarketDataProvider = {
  async getDailySeries() {
    return [
      { date: "2024-01-02", value: 184.25 },
      { date: "2024-01-03", value: 182.5 },
      { date: "2024-01-04", value: 181.75 },
      { date: "2024-01-05", value: 183.1 },
      { date: "2024-01-06", value: 184.8 }
    ];
  }
};

describe("MetricsService", () => {
  it("calculates summary metrics", async () => {
    const service = new MetricsService(provider);
    const summary = await service.getSummary("aapl");

    expect(summary.symbol).toBe("AAPL");
    expect(summary.latest).toBe(184.8);
    expect(summary.rangeHigh).toBe(184.8);
    expect(summary.rangeLow).toBe(181.75);
  });

  it("returns time series", async () => {
    const service = new MetricsService(provider);
    const series = await service.getTimeSeries("aapl", 3);

    expect(series).toHaveLength(3);
    expect(series[0].date).toBe("2024-01-04");
  });
});
