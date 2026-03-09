---
id: S06
title: Zustand Store
status: pending
priority: 6
depends_on: [S03]
---

# S06: Zustand Store

## Description
Create the Zustand game store that bridges the pure engine functions to React. The store exposes the current `GameState` and two actions: `playMove(boardIndex, cellIndex)` which delegates to the engine's `makeMove` and updates state on valid moves, and `resetGame()` which resets to the initial state.

## Acceptance Criteria (EARS)
- When a component calls `playMove` with valid arguments, the system shall update the store's game state to reflect the new move.
- When a component calls `resetGame`, the system shall reset the store's game state to the initial state with Player X as the current player and all boards empty.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D3 (Zustand Store), Zustand Store Interface section
- Key files to create: `src/store/gameStore.ts`
- Depends on S03 for the engine functions the store delegates to
