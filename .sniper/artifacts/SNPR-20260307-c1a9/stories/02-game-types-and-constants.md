---
id: 2
title: Game Types and Constants
status: pending
priority: 1
depends_on: [1]
---

# Game Types and Constants

## Description
Define the TypeScript types for the game data model and the constants used by game logic. This includes the `Player`, `CellValue`, `BoardResult`, `GameState`, and `GameAction` types, the `WIN_LINES` constant, and an `initialGameState` factory function.

## Acceptance Criteria
- The system shall export types `Player`, `CellValue`, `BoardResult`, `GameState`, and `GameAction` from `src/game/types.ts` matching the data model in the architecture plan.
- The system shall export a `WIN_LINES` constant from `src/game/constants.ts` containing all 8 winning line index triples for a 3x3 grid.
- The system shall export a `createInitialState()` function from `src/game/constants.ts` that returns a valid `GameState` with 9 empty boards, no results, `activeBoardIndex` of `null`, `currentPlayer` of `'X'`, no winner, and `isDraw` false.
- When `createInitialState()` is called, the system shall return a new object each time (no shared references between calls).

## Technical Context
- **Plan.md references:** Data Model section, Decision #3 (flat 0-8 addressing), Decision #6 (hardcoded win lines)
- **Key files:** `src/game/types.ts`, `src/game/constants.ts`
