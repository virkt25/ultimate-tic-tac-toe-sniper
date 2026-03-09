---
id: S03
title: Game Engine — Core
status: pending
priority: 3
depends_on: [S02]
---

# S03: Game Engine — Core

## Description
Implement the core game engine as pure functions: `createInitialState` to produce a fresh game state, `checkWinner` and `getWinningLine` to detect three-in-a-row at both sub-board and meta-board levels, `getNextActiveBoard` to compute the move constraint, and `makeMove` to validate and apply a move, returning the updated game state or null for invalid moves.

## Acceptance Criteria (EARS)
- When `makeMove` is called with a valid board index, cell index, and game state, the system shall return a new `GameState` with the mark placed, the current player switched, and the active board updated according to the move-constraint rule.
- When `makeMove` is called with an invalid move (occupied cell, wrong board, game already over), the system shall return `null` without modifying the original state.
- When a player completes three in a row within a sub-board, the system shall update that sub-board's outcome to reflect the winning player.
- When a player wins three sub-boards in a row on the meta-board, the system shall set the game status to `won`, record the winner, and store the winning line indices.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D2 (Pure Functions), D6 (Win Detection), Engine Function Signatures
- Key files to create: `src/engine/engine.ts`
- Depends on S02 for types and constants
