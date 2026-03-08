# S02: Game Types and Constants

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S02
**Dependencies:** S01

---

## Summary

Define the TypeScript types and constants that form the data model for the game engine. This includes all type definitions (`Player`, `CellState`, `BoardResult`, `Move`, `GameState`) and constants (`WINNING_LINES`, initial state factory) as specified in the architecture plan.

## Architecture Reference

- **Plan section 2** — Data Model (all type definitions and index mapping strategy)
- **Plan section 3** — Game Engine API (`createInitialState` factory function)
- **ADR-2** — Flat array indexing (0-8) over 2D [row][col]

## Acceptance Criteria

1. **Ubiquitous:** The `src/engine/types.ts` file shall export the types `Player`, `CellState`, `BoardResult`, `Move`, and `GameState` exactly as defined in plan section 2.
2. **Ubiquitous:** The `GameState` interface shall include fields for `boards` (9 arrays of 9 cells), `boardResults` (9 entries), `currentPlayer`, `activeBoard`, `winner`, `lastMove`, and `moveHistory`.
3. **Ubiquitous:** The `src/engine/constants.ts` file shall export a `WINNING_LINES` constant containing all 8 winning line index triplets (3 rows, 3 columns, 2 diagonals).
4. **Ubiquitous:** The `src/engine/constants.ts` file shall export a `createInitialState()` function that returns a valid `GameState` with empty boards, null results, player X as current player, null active board, null winner, null lastMove, and empty moveHistory.
5. **Ubiquitous:** The data model shall use flat 0-8 indexing where `index = row * 3 + col` as specified in ADR-2.
