---
id: S08
title: Game Interaction
status: pending
priority: 8
depends_on: [S06, S07]
---

# S08: Game Interaction

## Description
Wire up click handling so that clicking a cell calls the store's `playMove` action. Implement active board highlighting so that the sub-board(s) where the current player is allowed to move are visually distinguished, and non-active sub-boards appear dimmed or de-emphasized. Invalid clicks (wrong board, occupied cell, game over) are silently ignored.

## Acceptance Criteria (EARS)
- When a player clicks a valid empty cell in the active sub-board, the system shall place the current player's mark in that cell and switch the turn to the other player.
- The system shall visually highlight the sub-board(s) where the current player is allowed to move, and de-emphasize all non-active sub-boards.
- If a player clicks a cell in a non-active sub-board, an occupied cell, or any cell after the game has ended, the system shall ignore the click with no change to the board state.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D8 (Component Responsibility), PRD FR-3.1, FR-3.2, FR-6
- Key files to modify: `src/components/Cell.tsx`, `src/components/SubBoard.tsx`, `src/components/SubBoard.module.css`, `src/components/Cell.module.css`
- Depends on S06 for the store actions and S07 for the rendered board components
