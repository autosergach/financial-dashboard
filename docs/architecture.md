# Architecture

## Overview
The system is split into a backend metrics API and a frontend analytics dashboard. Data flows from ingestion to aggregation and is exposed via stable DTOs for visualization. The frontend includes a toolbar to control periods, modes, and visible widgets.

## Data flow
```mermaid
flowchart LR
  A["External sources"] --> B["Ingestion adapters"]
  B --> C["Normalization"]
  C --> D["Aggregation"]
  D --> E["Metrics API"]
  E --> F["Frontend dashboard"]
```

## Backend layers
- domain: core entities, value objects, and invariants.
- application: use-cases that orchestrate domain logic.
- infrastructure: integrations, persistence, and external APIs.
- interfaces: HTTP controllers, DTOs, and validation.

### Cache
- in-memory cache wraps the market data provider.
- TTL configurable via `CACHE_TTL_MS`.

## Frontend layers
- api: data fetching and DTO mapping.
- app: local state for toolbar, filters, and widget toggles.
- components: reusable widgets (cards, charts, tables).

## Non-goals (initial)
- Real-time streaming. Polling with cache is enough for v1.
- Complex permissions model. Public read-only dashboard for v1.
