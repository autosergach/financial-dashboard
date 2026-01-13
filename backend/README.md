# Backend

Metrics API for the Financial Dashboard. Provides summary KPIs, time series data, and top assets derived from public market data.

## Stack
- Node.js + Express
- TypeScript
- Jest + Supertest

## Endpoints
- `GET /health`
- `GET /metrics/summary?symbol=aapl`
- `GET /metrics/timeseries?symbol=aapl&points=30`
- `GET /metrics/top-assets?symbols=aapl,msft,amzn`

## Data source
Stooq CSV API (no auth required):
- `https://stooq.com/q/d/l/?s=aapl.us&i=d`

## Cache
In-memory cache for market data. Configure TTL with `CACHE_TTL_MS` (default 300000).

## Fallback
If upstream data is unavailable, the API falls back to deterministic mock data to keep demos stable.

## Development
```
cd backend
npm install
npm run dev
```

## Tests
```
cd backend
npm test
```
