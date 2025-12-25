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
- `GET /metrics/top-assets`

## Data source
Stooq CSV API (no auth required):
- `https://stooq.com/q/d/l/?s=aapl.us&i=d`

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
