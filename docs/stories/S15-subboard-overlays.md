# Story S15: Implement sub-board win/draw overlays

> **Epic:** E05-game-state-ui
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S10, S14

## Description

Create a SubBoardOverlay component that renders over a SubBoard when it is won or drawn. When won by X, display a large X mark in blue. When won by O, display a large O mark in red. When drawn, display a greyed-out state with no symbol. The original cells remain visible underneath at reduced opacity so players can review what happened in that sub-board.

## Embedded Context

### From PRD

- **FR-030:** Won sub-boards display a prominent mark (X or O) indicating the winner.
- **FR-031:** Drawn sub-boards have a visually distinct treatment (greyed out, no symbol).
- **US-004:** As a player, I want to see win detection visually so I know when a sub-board is decided.
- **US-008:** As a player, I want tied sub-boards handled visually so I understand they are no longer in play.
- **US-011:** As a player, I want a clear visual indication when a sub-board is won.
- **US-020 (P2):** As a player, I want color-coded scanning to quickly assess which sub-boards belong to which player.

### From Architecture

- SubBoard checks `subBoardStatus` from the Zustand store to determine if the board is won or drawn.
- SubBoardOverlay renders as an absolutely positioned element over the SubBoard.
- The overlay is a sibling or child of SubBoard, positioned with `position: absolute` inside a `position: relative` SubBoard container.

### From UX Spec

- **SubBoardOverlay states:**
  - **wonX:** Large X mark in blue (`#2563EB`), semi-transparent background overlay.
  - **wonO:** Large O mark in red (`#DC2626`), semi-transparent background overlay.
  - **drawn:** Muted grey background (`#F3F4F6`, gray-100), no symbol displayed.
- **Mark sizing:** Sub-board overlay marks sized to 80% of the sub-board area.
- **Transition:** Overlay appears immediately upon sub-board resolution (subtle 150ms fade is acceptable but not required).
- **Cell visibility:** Original cells remain visible underneath the overlay at reduced opacity (e.g., `opacity: 0.3`).
- **Accessibility:** `aria-hidden="true"` on the overlay element since it is decorative (the game state is conveyed through other means).

## Acceptance Criteria

1. **Given** a sub-board won by X, **When** rendered, **Then** a large blue X mark (#2563EB) overlays the sub-board with a semi-transparent background.
2. **Given** a sub-board won by O, **When** rendered, **Then** a large red O mark (#DC2626) overlays the sub-board with a semi-transparent background.
3. **Given** a drawn sub-board, **When** rendered, **Then** it has a greyed-out appearance (#F3F4F6) with no symbol.
4. **Given** a won sub-board, **When** rendered, **Then** the original cells are visible underneath the overlay at reduced opacity.
5. **Given** a won or drawn sub-board, **When** a cell within it is clicked, **Then** no move is executed (the board is inactive).

## Test Requirements

- [ ] Unit tests: SubBoardOverlay renders with X mark when sub-board status is wonX.
- [ ] Unit tests: SubBoardOverlay renders with O mark when sub-board status is wonO.
- [ ] Unit tests: SubBoardOverlay renders with grey background and no mark when sub-board status is drawn.
- [ ] Unit tests: SubBoardOverlay has `aria-hidden="true"` attribute.
- [ ] Integration tests: Clicking a cell in a won sub-board does not call placeMove.

## Implementation Notes

- SubBoard container needs `position: relative` to anchor the absolutely positioned overlay.
- SubBoardOverlay: `position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;`.
- The overlay background should be semi-transparent white (e.g., `rgba(255, 255, 255, 0.7)`) for won states, and opaque grey for drawn state.
- The large mark can be rendered as text with large font-size (80% of container) or as an SVG.
- Cells underneath: apply `opacity: 0.3` to the cells container when the sub-board has a result, or let the overlay's semi-transparent background handle the visual dimming.
- Create `SubBoardOverlay.module.css` for overlay-specific styles.
- The overlay inherently blocks click events on cells underneath, which enforces the inactive state.

## Out of Scope

- Meta-board winning line indicator (S19)
- Game-over overlay (S17)
- Animation/transition effects beyond simple appearance
