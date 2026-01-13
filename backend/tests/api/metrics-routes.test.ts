import request from "supertest";
import express from "express";
import { MetricsService } from "../../src/application/metrics-service.js";
import type { MarketDataProvider } from "../../src/infrastructure/market-data-provider.js";
import { createMetricsRouter } from "../../src/interfaces/http/metrics-routes.js";

const provider: MarketDataProvider = {
  async getDailySeries() {
    return [
      { date: "2024-01-02", value: 100 },
      { date: "2024-01-03", value: 105 },
      { date: "2024-01-04", value: 110 }
    ];
  }
};

function createApp(customProvider: MarketDataProvider = provider) {
  const app = express();
  const service = new MetricsService(customProvider);
  app.use("/metrics", createMetricsRouter(service));
  return app;
}

describe("metrics routes", () => {
  it("returns summary", async () => {
    const app = createApp();
    const response = await request(app).get("/metrics/summary?symbol=aapl");

    expect(response.status).toBe(200);
    expect(response.body.data.symbol).toBe("AAPL");
  });

  it("returns time series", async () => {
    const app = createApp();
    const response = await request(app).get("/metrics/timeseries?points=2");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it("rejects invalid points", async () => {
    const app = createApp();
    const response = await request(app).get("/metrics/timeseries?points=0");

    expect(response.status).toBe(400);
  });

  it("returns top assets", async () => {
    const app = createApp();
    const response = await request(app).get("/metrics/top-assets");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("accepts symbols query", async () => {
    const app = createApp();
    const response = await request(app).get(
      "/metrics/top-assets?symbols=aapl,msft"
    );

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("handles upstream errors", async () => {
    const failingProvider: MarketDataProvider = {
      async getDailySeries() {
        throw new Error("boom");
      }
    };
    const app = createApp(failingProvider);
    const response = await request(app).get("/metrics/summary?symbol=aapl");

    expect(response.status).toBe(502);
  });
});
