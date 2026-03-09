---
id: S10
title: Game Status & Controls
status: pending
priority: 10
depends_on: [S06]
---

# S10: Game Status & Controls

## Description
Implement the `GameStatus` component that displays the current player's turn during play and shows a win or draw message when the game ends. Implement the `Controls` component with a "New Game" button that resets all game state to the initial state.

## Acceptance Criteria (EARS)
- While the game is in progress, the system shall display the current player (X or O) in a status area that updates after every move.
- When the game is won, the system shall display a victory message identifying the winning player.
- When the game ends in a draw, the system shall display a draw message.
- When a player clicks the "New Game" button, the system shall clear all marks, reset the board to its initial state, set the current player to X, and highlight all sub-boards as active.
- The system shall make the "New Game" button visible and functional at all times (during play, after a win, after a draw).

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — Components section (GameStatus, Controls), PRD FR-2.3, FR-5.2, FR-5.4, FR-8
- Key files to create: `src/components/GameStatus.tsx`, `src/components/GameStatus.module.css`, `src/components/Controls.tsx`, `src/components/Controls.module.css`
- Depends on S06 for store access to game state and reset action
