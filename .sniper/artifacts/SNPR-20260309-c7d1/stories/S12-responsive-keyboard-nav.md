---
id: S12
title: Responsive Layout & Keyboard Navigation
status: pending
priority: 12
depends_on: [S07]
---

# S12: Responsive Layout & Keyboard Navigation

## Description
Add responsive CSS media queries so the game displays optimally on desktop (1024px+), remains functional on tablet (768px-1023px), and is usable on narrow viewports (<768px). Implement keyboard navigation with `tabIndex` management so that cells in active sub-boards are tabbable and arrow keys move focus within a sub-board. Ensure all cells have appropriate ARIA labels and sufficient color contrast.

## Acceptance Criteria (EARS)
- While on a desktop viewport (1024px and above), the system shall display the game board and controls well-proportioned with no overflow or scrolling needed.
- While on a tablet viewport (768px to 1023px), the system shall render all 81 cells as visible and tappable, reflowing the layout as needed while keeping the game fully playable.
- While on a viewport narrower than 768px, the system shall render the board without horizontal overflow.
- When a user navigates with the keyboard, the system shall allow all cells to be reached and activated using Tab and arrow keys, with Enter or Space to place a mark.
- The system shall ensure all interactive cells meet WCAG 2.1 AA contrast ratios (4.5:1 for text, 3:1 for UI components) against the dark background.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D7 (Keyboard Navigation), PRD FR-10, FR-11
- Key files to modify: `src/components/Cell.tsx`, `src/components/Cell.module.css`, `src/components/SubBoard.module.css`, `src/components/MetaBoard.module.css`, `src/components/App.module.css`, `src/global.css`
- Depends on S07 for the base board rendering components
