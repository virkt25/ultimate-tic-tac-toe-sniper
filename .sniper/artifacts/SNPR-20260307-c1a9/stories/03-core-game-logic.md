---
id: 3
title: Core Game Logic
status: pending
priority: 1
depends_on: [2]
---

# Core Game Logic

## Description
Implement the pure game logic functions in `src/game/logic.ts` and the game reducer in `src/game/reducer.ts`. These functions handle move validation, cell placement, board/game result checking, and next-active-board determination. Comprehensive unit tests must cover all standard moves and edge cases.

## Acceptance Criteria
- The system shall export a `validateMove` function that returns `true` only when the game is not over, the target board matches the active board (or active board is `null`), the cell is empty, and the board is not decided.
- When a valid `PLAY_CELL` action is dispatched, the system shall place the current player's mark in the specified cell, check board and game results, compute the next active board, and toggle the current player.
- If a player is sent to a decided board (won or drawn), the system shall set `activeBoardIndex` to `null`, granting a free move.
- When a player completes three in a row within a small board, the system shall record that board's result as the winning player.
- When a player wins three boards in a row on the meta-grid, the system shall set `winner` to that player.
- If all 9 boards are decided and no player has three in a row on the meta-grid, the system shall set `isDraw` to `true`.
- When a `NEW_GAME` action is dispatched, the system shall reset state to `createInitialState()`.
- The system shall have unit tests covering: valid move placement, invalid move rejection (wrong board, occupied cell, decided board, game over), free move activation, small board win detection, small board draw detection, meta-game win detection, meta-game draw detection.

## Technical Context
- **Plan.md references:** State Flow section (move lifecycle), Key logic functions, Decision #1 (pure functions), Decision #2 (single useReducer), Decision #6 (win lines)
- **Key files:** `src/game/logic.ts`, `src/game/reducer.ts`, `src/game/logic.test.ts`, `src/game/reducer.test.ts`
