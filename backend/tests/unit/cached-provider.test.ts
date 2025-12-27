import { CachedMarketDataProvider } from "../../src/infrastructure/cached-market-data-provider.js";
import type { MarketDataProvider } from "../../src/infrastructure/market-data-provider.js";

function createProvider() {
  let calls = 0;
  const provider: MarketDataProvider = {
    async getDailySeries() {
      calls += 1;
      return [{ date: "2024-01-02", value: 100 }];
    }
  };

  return { provider, getCalls: () => calls };
}

describe("CachedMarketDataProvider", () => {
  it("caches data within ttl", async () => {
    const { provider, getCalls } = createProvider();
    const cached = new CachedMarketDataProvider(provider, 1000);

    await cached.getDailySeries("aapl");
    await cached.getDailySeries("aapl");

    expect(getCalls()).toBe(1);
  });
});
