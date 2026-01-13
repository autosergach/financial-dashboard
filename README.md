# financial-dashboard

Financial analytics dashboard that aggregates public market data and visualizes KPIs, time series, and top assets. Built to demonstrate clean architecture, clear data contracts, and production-grade documentation.

## What this app does
- Ingests daily close prices from Stooq (no API key required).
- Aggregates metrics in a clean layered backend.
- Presents insights in a strict, analytics-first Angular dashboard.

## Screenshots
Add screenshots to `docs/assets/` and update links below.

- `docs/assets/dashboard-overview.png`
- `docs/assets/toolbar-modes.png`

## Architecture
- Backend: modular monolith with domain/application/infrastructure/interfaces layers.
- Frontend: Angular SPA with a thin API layer and reusable widgets.
- Pipeline: ingestion -> normalization -> aggregation -> presentation.

See `docs/architecture.md` and `docs/adr/` for decisions and diagrams.

## Project structure
```
/
  backend/
    src/
      domain/
      application/
      infrastructure/
      interfaces/
  frontend/
    src/
      api/
      app/
  docs/
    adr/
    assets/
```

## API
- `GET /health`
- `GET /metrics/summary?symbol=aapl`
- `GET /metrics/timeseries?symbol=aapl&points=30`
- `GET /metrics/top-assets?symbols=aapl,msft,amzn`

## Local development
Backend:
```
cd backend
npm install
npm run dev
```

Frontend:
```
cd frontend
npm install
npm start
```

The frontend proxies `/api` to `http://localhost:3000`.

## Testing
Backend:
```
cd backend
npm test
```

Frontend:
```
cd frontend
npm test
```

## Documentation
- `docs/architecture.md`
- `docs/adr/`
- `docs/glossary.md`

## Contribution
- Conventional Commits (e.g. `feat(api): add summary endpoint`).
- Feature branches per task.
- See `CONTRIBUTING.md`.

## License
MIT. See `LICENSE`.
