---
id: S04
title: Game Engine — Draw & Edge Cases
status: pending
priority: 4
depends_on: [S03]
---

# S04: Game Engine — Draw & Edge Cases

## Description
Implement early draw detection (`isEarlyDraw`), full-board draw detection (all sub-boards decided with no meta-board winner), and the free-move fallback (when a player is sent to an already-decided sub-board, all playable sub-boards become valid targets).

## Acceptance Criteria (EARS)
- When all 9 sub-boards are decided (won or drawn) and no player has three in a row on the meta-board, the system shall declare the game a draw.
- If during play no possible sequence of future sub-board outcomes can give either player three in a row on the meta-board, the system shall declare the game a draw immediately.
- When a player's move sends the opponent to a sub-board that is already won or fully filled, the system shall set the active board to null, allowing the opponent to play in any playable sub-board.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D6 (Early Draw Detection), PRD FR-3.3, FR-5.4, FR-5.5
- Key files to modify: `src/engine/engine.ts`
- Depends on S03 for the core engine functions
