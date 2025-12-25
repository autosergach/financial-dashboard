import { Router } from "express";
import type { MetricsService } from "../../application/metrics-service.js";

export function createMetricsRouter(service: MetricsService): Router {
  const router = Router();

  router.get("/summary", async (req, res) => {
    const symbol = getSymbol(req.query.symbol);
    const summary = await service.getSummary(symbol);
    res.json({ data: summary });
  });

  router.get("/timeseries", async (req, res) => {
    const symbol = getSymbol(req.query.symbol);
    const points = getNumber(req.query.points, 30);
    const series = await service.getTimeSeries(symbol, points);
    res.json({ data: series });
  });

  router.get("/top-assets", async (_req, res) => {
    const symbols = ["aapl", "msft", "amzn", "goog", "meta", "tsla"];
    const top = await service.getTopAssets(symbols);
    res.json({ data: top });
  });

  return router;
}

function getSymbol(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "aapl";
}

function getNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
