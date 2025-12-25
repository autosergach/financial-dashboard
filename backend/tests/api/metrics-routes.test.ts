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

function createApp() {
  const app = express();
  const service = new MetricsService(provider);
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

  it("returns top assets", async () => {
    const app = createApp();
    const response = await request(app).get("/metrics/top-assets");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
