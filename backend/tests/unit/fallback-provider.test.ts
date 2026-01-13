import { FallbackMarketDataProvider } from "../../src/infrastructure/fallback-market-data-provider.js";
import type { MarketDataProvider } from "../../src/infrastructure/market-data-provider.js";

const failingProvider: MarketDataProvider = {
  async getDailySeries() {
    throw new Error("fail");
  }
};

const fallbackProvider: MarketDataProvider = {
  async getDailySeries() {
    return [{ date: "2024-01-01", value: 100 }];
  }
};

describe("FallbackMarketDataProvider", () => {
  it("returns fallback data when primary fails", async () => {
    const provider = new FallbackMarketDataProvider(
      failingProvider,
      fallbackProvider
    );

    const series = await provider.getDailySeries("aapl");

    expect(series).toHaveLength(1);
    expect(series[0].value).toBe(100);
  });
});
