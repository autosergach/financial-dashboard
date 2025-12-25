import express from "express";
import { MetricsService } from "./application/metrics-service.js";
import { StooqProvider } from "./infrastructure/data/stooq-provider.js";
import { createMetricsRouter } from "./interfaces/http/metrics-routes.js";

const app = express();
const provider = new StooqProvider();
const metricsService = new MetricsService(provider);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/metrics", createMetricsRouter(metricsService));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Metrics API running on :${port}`);
});
