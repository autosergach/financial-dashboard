# ADR 0002: Public market data source

## Status
Accepted

## Context
We need a public data source that does not require API keys to keep onboarding friction low.

## Decision
Use Stooq CSV endpoints for daily data:
- `https://stooq.com/q/d/l/?s=aapl.us&i=d`

## Consequences
- Simple, keyless data access.
- CSV parsing required in the ingestion adapter.
- Availability depends on Stooq uptime.
