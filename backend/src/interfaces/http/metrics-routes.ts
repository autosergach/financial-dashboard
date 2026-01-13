import { Router } from "express";
import type { MetricsService } from "../../application/metrics-service.js";

export function createMetricsRouter(service: MetricsService): Router {
  const router = Router();

  router.get("/summary", async (req, res) => {
    try {
      const symbol = getSymbol(req.query.symbol);
      const summary = await service.getSummary(symbol);
      res.json({ data: summary });
    } catch {
      res.status(502).json({ error: "Upstream data unavailable" });
    }
  });

  router.get("/timeseries", async (req, res) => {
    const points = getNumber(req.query.points, 30);
    if (points <= 0) {
      res.status(400).json({ error: "points must be greater than 0" });
      return;
    }

    try {
      const symbol = getSymbol(req.query.symbol);
      const series = await service.getTimeSeries(symbol, points);
      res.json({ data: series });
    } catch {
      res.status(502).json({ error: "Upstream data unavailable" });
    }
  });

  router.get("/top-assets", async (_req, res) => {
    try {
      const symbols = getSymbols(_req.query.symbols);
      const top = await service.getTopAssets(symbols);
      res.json({ data: top });
    } catch {
      res.status(502).json({ error: "Upstream data unavailable" });
    }
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

function getSymbols(value: unknown): string[] {
  if (typeof value !== "string" || value.trim().length === 0) {
    return ["aapl", "msft", "amzn", "goog", "meta", "tsla"];
  }

  return value
    .split(",")
    .map((symbol) => symbol.trim())
    .filter((symbol) => symbol.length > 0);
}
