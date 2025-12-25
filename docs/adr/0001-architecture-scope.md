# ADR 0001: Architecture scope

## Status
Accepted

## Context
We need a clean, testable structure that can grow without premature complexity. The project should demonstrate architectural thinking but remain compact for portfolio purposes.

## Decision
Start with a modular monolith in a single repository:
- Separate backend and frontend folders.
- Strict layering in the backend (domain/application/infrastructure/interfaces).
- Keep integrations behind adapters to allow future service extraction.

## Consequences
- Fast iteration in early stages.
- Clear boundaries for tests and documentation.
- Easy path to split services later if needed.
