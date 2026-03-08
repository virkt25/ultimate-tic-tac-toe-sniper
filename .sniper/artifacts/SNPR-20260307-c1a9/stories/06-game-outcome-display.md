---
id: 6
title: Game Outcome Display
status: pending
priority: 2
depends_on: [4]
---

# Game Outcome Display

## Description
Display clear game outcome messaging when the game ends (win or draw). Update the header and provide a prominent call to action to start a new game.

## Acceptance Criteria
- When a player wins the game, the system shall display a winner announcement showing the winning player's symbol (X or O) in the `GameHeader`.
- When the game ends in a draw, the system shall display a draw declaration in the `GameHeader`.
- While the game is over (won or drawn), the system shall prevent any further cell clicks from modifying game state.
- When the game ends, the system shall visually emphasize the "New Game" button to prompt replay.

## Technical Context
- **Plan.md references:** Components section (GameHeader responsibilities), State Flow (game result checking)
- **Key files:** `src/components/GameHeader.tsx`, `src/components/GameControls.tsx`, `src/components/Cell.tsx`
