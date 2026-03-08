---
id: 4
title: Board UI Components
status: pending
priority: 2
depends_on: [3]
---

# Board UI Components

## Description
Build the core visual components: `MetaBoard`, `SmallBoard`, `Cell`, `GameHeader`, and `GameControls`. Wire them to the game reducer in `App.tsx` so the game is fully playable. This story delivers a functional game without visual polish, overlays, or persistence.

## Acceptance Criteria
- The system shall render a 3x3 grid of `SmallBoard` components inside `MetaBoard`, each containing a 3x3 grid of `Cell` components.
- When a player clicks a valid empty cell, the system shall place their mark (X or O) and update the turn indicator.
- When a player clicks an invalid cell (wrong board, occupied, or game over), the system shall ignore the click with no state change.
- The `GameHeader` shall display the current player's symbol when the game is in progress.
- When a player clicks "New Game" in `GameControls`, the system shall reset the board to its initial empty state.
- The system shall pass `isValid` to each `Cell` indicating whether it is a legal move target, and cells shall be visually distinguishable based on this flag (e.g., cursor style).

## Technical Context
- **Plan.md references:** Components section, component responsibilities, State Flow section
- **Key files:** `src/App.tsx`, `src/components/MetaBoard.tsx`, `src/components/SmallBoard.tsx`, `src/components/Cell.tsx`, `src/components/GameHeader.tsx`, `src/components/GameControls.tsx`
