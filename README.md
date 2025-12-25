# financial-dashboard

Financial analytics dashboard that aggregates market data and presents KPIs, time series, and top assets in a clean, testable architecture.

## Goals
- Clear architecture (domain / application / infrastructure / interfaces).
- Reliable metrics API with deterministic data contracts.
- Insightful UI with charts and tables, built for fast iteration.
- Strong documentation, tests, and CI to showcase engineering discipline.

## Architecture (planned)
- Backend: modular monolith with clean layers and adapter-based integrations.
- Frontend: SPA with a small, predictable state layer and reusable data widgets.
- Data pipeline: ingestion -> normalization -> aggregation -> presentation.

See `docs/architecture.md` and `docs/adr/` for decisions and diagrams.

## Project structure (planned)
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
      components/
      pages/
      store/
  docs/
    adr/
    assets/
```

## API sketch (planned)
- `GET /metrics/summary`
- `GET /metrics/timeseries`
- `GET /metrics/top-assets`

## Getting started
Implementation starts after documentation and architecture baselines are complete.

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
