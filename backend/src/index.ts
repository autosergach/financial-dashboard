import express from "express";
import { MetricsService } from "./application/metrics-service.js";
import { CachedMarketDataProvider } from "./infrastructure/cached-market-data-provider.js";
import { FallbackMarketDataProvider } from "./infrastructure/fallback-market-data-provider.js";
import { StooqProvider } from "./infrastructure/data/stooq-provider.js";
import { MockMarketDataProvider } from "./infrastructure/data/mock-provider.js";
import { createMetricsRouter } from "./interfaces/http/metrics-routes.js";

const app = express();
const ttlMs = Number(process.env.CACHE_TTL_MS ?? 300000);
const provider = new CachedMarketDataProvider(
  new FallbackMarketDataProvider(new StooqProvider(), new MockMarketDataProvider()),
  ttlMs
);
const metricsService = new MetricsService(provider);

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/metrics", createMetricsRouter(metricsService));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Metrics API running on :${port}`);
});
