# Story S14: Implement active board highlighting

> **Epic:** E05-game-state-ui
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S10

## Description

Add visual highlighting to active sub-boards so players can immediately identify where they must play. Inactive boards appear with normal styling and reject input. In the free move state (when the target board is already won or drawn), all remaining open boards are highlighted.

## Embedded Context

### From PRD

- **FR-022:** Highlight the active sub-board(s) with a distinct visual indicator.
- **FR-023:** Non-active boards must visually reject input (no pointer cursor, no hover effects).
- **US-003:** As a player, I want to see which board I must play in so I know where my next move goes.
- **US-009:** As a player, I want all open boards highlighted during a free move so I know I can choose any open board.
- **US-012:** As a player, I want invalid click feedback (via highlighting) so I understand why a move was rejected.

### From Architecture

- SubBoard reads `activeBoards` from the Zustand store via a selector.
- Active state is determined by checking if the SubBoard's `boardIndex` is included in the `activeBoards` array.
- CSS classes are applied conditionally based on active state.

### From UX Spec

- **SubBoard active state:**
  - Border: 2px solid blue-500 (`#3B82F6`).
  - Background: light blue tint (`#DBEAFE`, blue-100).
- **SubBoard inactive state:**
  - Normal appearance (no special border, default background).
  - Default cursor (`cursor: default`).
- **Cell hover state (desktop only):**
  - On empty cells in active boards: subtle background tint (`#F9FAFB`, gray-50).
  - Pointer cursor (`cursor: pointer`) on active empty cells.
- **Cell disabled state:**
  - No hover tint effect.
  - No pointer cursor change.
  - Applies to cells in inactive boards and to filled cells.

## Acceptance Criteria

1. **Given** one active board (standard move targeting), **When** the MetaBoard renders, **Then** that board has a blue border (#3B82F6) and light blue background (#DBEAFE).
2. **Given** inactive boards, **When** rendered, **Then** they have normal appearance with no highlight border and use the default cursor.
3. **Given** a free move state, **When** rendered, **Then** all open (not won, not drawn) boards are highlighted with the active styling.
4. **Given** an active board on desktop, **When** hovering over an empty cell, **Then** a subtle gray tint (#F9FAFB) appears on the cell.
5. **Given** an inactive board, **When** hovering over any cell, **Then** no tint or pointer cursor change occurs.

## Test Requirements

- [ ] Unit tests: SubBoard with active state has the highlight CSS class applied.
- [ ] Unit tests: SubBoard without active state does not have the highlight CSS class.
- [ ] Unit tests: All open boards have highlight class when activeBoards contains multiple indices (free move).
- [ ] Integration tests: Clicking a cell in an inactive board does not trigger placeMove.

## Implementation Notes

- Add conditional class in SubBoard: `className={activeBoards.includes(boardIndex) ? styles.active : styles.inactive}`.
- Define `.active` and `.inactive` classes in `SubBoard.module.css`.
- Cell hover style should use `:hover` pseudo-class scoped to cells within active sub-boards. This can be achieved with a parent `.active` class: `.active .cell:hover { background-color: var(--color-cell-hover); }`.
- Add `--color-active-border: #3B82F6`, `--color-active-bg: #DBEAFE`, and `--color-cell-hover: #F9FAFB` to the design tokens in index.css.
- The `activeBoards` selector should use shallow equality comparison to prevent unnecessary re-renders.

## Out of Scope

- Won/drawn sub-board overlays (S15)
- Keyboard focus indicators and navigation (S23)
- Animations or transitions on highlight state changes
