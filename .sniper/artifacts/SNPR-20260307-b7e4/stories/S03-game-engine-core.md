# S03: Game Engine Core

## Description
Implement the core game engine as pure functions: creating a new game, making a move, applying the send rule, and handling the free move exception.

## Acceptance Criteria (EARS)
- When `createGame()` is called, the system shall return an initial `GameState` with all 81 cells empty, all sub-boards active, Player X as the current player, no active sub-board constraint (free move), and no game outcome.
- When a valid move is submitted via `makeMove(state, move)`, the system shall return a new `GameState` with the cell marked, the current player toggled, and the active sub-board constraint updated according to the send rule.
- When the send rule directs the next player to a sub-board that is won or drawn, the system shall set the active sub-board constraint to null, granting the next player a free move to any active sub-board.
- When an invalid move is submitted (occupied cell, wrong sub-board, won/drawn sub-board), the system shall reject the move by returning the unchanged state or throwing a descriptive error.
- When a player has a free move, the system shall allow placement in any cell of any sub-board that is neither won nor drawn.

## Dependencies
- S02: Game Types and Constants

## Notes
- All engine functions must be pure (no side effects, no framework imports)
- The engine does not detect wins or draws -- that is S04. This story focuses on move mechanics and the send rule.
- `makeMove` should be the single entry point for advancing game state
- Place in `src/engine/engine.ts`
