---
id: 5
title: Board Highlighting and Overlays
status: pending
priority: 2
depends_on: [4]
---

# Board Highlighting and Overlays

## Description
Add active-board highlighting, won-board overlays, and tied-board visuals. These are the key UX differentiators that make the meta-game state glanceable and the active constraint obvious.

## Acceptance Criteria
- While a specific board is active (`activeBoardIndex` is non-null), the system shall visually highlight that board with a distinct border or background tint, and non-active undecided boards shall appear muted.
- While the player has a free move (`activeBoardIndex` is null and game is in progress), the system shall highlight all undecided boards.
- When a small board is won, the system shall overlay a large X or O symbol on that board, replacing the individual cell display.
- When a small board is drawn, the system shall display it with reduced opacity and a greyed-out appearance.
- The system shall use colors and shapes (not color alone) to distinguish X and O marks, supporting colorblind accessibility.

## Technical Context
- **Plan.md references:** Components section (SmallBoard overlay behavior), Derived display state (highlighted boards), Spec 1.3 (active board highlighting, won board visualization, accessible colors)
- **Key files:** `src/components/SmallBoard.tsx`, `src/components/MetaBoard.tsx`, `src/components/Cell.tsx`, `src/index.css`
