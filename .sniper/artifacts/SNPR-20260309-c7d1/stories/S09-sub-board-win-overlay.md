---
id: S09
title: Sub-Board Win Overlay
status: pending
priority: 9
depends_on: [S08]
---

# S09: Sub-Board Win Overlay

## Description
Create the `WinOverlay` component that displays a large X or O symbol overlaid on a won sub-board. The overlay animates into view using Motion. Won sub-boards with the overlay prevent further interaction with their cells.

## Acceptance Criteria (EARS)
- When a player completes three in a row within a sub-board, the system shall display a large X or O overlay on that sub-board, clearly indicating the winner with an animated entrance.
- While a sub-board is won, the system shall prevent any player from placing a mark in that sub-board, regardless of the active board constraint.
- When a sub-board is fully filled with no three-in-a-row for either player, the system shall visually indicate the sub-board as drawn without displaying a win overlay for either player.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D5 (Animation Strategy), Components section (WinOverlay), PRD FR-4.1, FR-4.2, FR-4.3
- Key files to create: `src/components/WinOverlay.tsx`, `src/components/WinOverlay.module.css`
- Key files to modify: `src/components/SubBoard.tsx`
- Depends on S08 for game interaction (moves that trigger sub-board wins)
