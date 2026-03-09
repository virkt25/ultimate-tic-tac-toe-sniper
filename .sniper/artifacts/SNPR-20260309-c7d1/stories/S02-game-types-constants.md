---
id: S02
title: Game Types & Constants
status: pending
priority: 2
depends_on: [S01]
---

# S02: Game Types & Constants

## Description
Define all TypeScript types and interfaces for the game data model (`CellValue`, `Player`, `BoardOutcome`, `GameStatus`, `GameState`) and the shared constants (`BOARD_SIZE`, `TOTAL_CELLS`, `TOTAL_BOARDS`, `WIN_LINES`).

## Acceptance Criteria (EARS)
- The system shall export TypeScript types (`CellValue`, `Player`, `BoardOutcome`, `GameStatus`) and the `GameState` interface from `src/engine/types.ts`, such that other modules can import and use them without type errors.
- The system shall export constants for board dimensions and all 8 winning line index triples from `src/engine/constants.ts`.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — Data Model section, D6 (Win Detection Algorithm)
- Key files to create: `src/engine/types.ts`, `src/engine/constants.ts`
- Depends on S01 for project structure and TypeScript configuration
