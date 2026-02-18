# Epic E05: Game State Indicators

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 14
> **Dependencies:** E04-board-rendering

## Scope

### In Scope
- TurnIndicator component showing current player
- Active board highlighting (visual distinction for valid move targets)
- Sub-board win overlays (large X or O when a sub-board is won)
- Sub-board draw state (greyed out appearance)
- Invalid move feedback (silent — highlighting guides the player)
- Last-move indicator (P2)

### Out of Scope
- Game-over overlay (E06)
- New Game button (E06)
- Responsive breakpoints for indicators (E07)
- Keyboard navigation (E08)
- Screen reader announcements (E08)

## Architecture Context

### TurnIndicator Component (from UX Spec)
- **States:** `playerX` (blue styling), `playerO` (red styling), `gameOver` (result text)
- **Props:** Reads from store: `currentPlayer`, `gameResult`
- **Position:** Always visible above the board, 18-20px semibold text

### SubBoard States (from UX Spec)
- `active` — Highlighted border (#3B82F6) + background (#DBEAFE). Accepts input.
- `inactive` — Normal appearance. Does not accept input. Default cursor.
- `wonX` — Large X overlay, blue, semi-transparent background. Not playable.
- `wonO` — Large O overlay, red, semi-transparent background. Not playable.
- `drawn` — Greyed out (#F3F4F6). Not playable.

### Cell States
- `empty` — Clickable if active board. Pointer cursor on hover (desktop).
- `hover` — Subtle background tint (#F9FAFB) on desktop.
- `filledX` / `filledO` — Shows mark. Not clickable.
- `lastMove` — Filled with subtle amber (#F59E0B) indicator.
- `disabled` — Empty but inactive board. No hover, no pointer.

### Interaction Patterns
- Cell fill: Instant (< 50ms). No animation.
- Turn switch: Immediate text/color update.
- Active board change: Highlight moves instantly. Previous highlight removed in same render.
- Sub-board win: Overlay appears immediately. Cells visible underneath at reduced opacity.

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S13 | Implement TurnIndicator component | S | S10 | frontend |
| S14 | Implement active board highlighting | M | S10 | frontend |
| S15 | Implement sub-board win/draw overlays | M | S10, S14 | frontend |
| S16 | Implement last-move indicator | S | S15 | frontend |

## Acceptance Criteria

1. Turn indicator shows "Player X" or "Player O" with correct color
2. Turn indicator updates immediately after each valid move
3. Turn indicator is visible without scrolling on all screen sizes
4. Active sub-board has distinct background (#DBEAFE) and border (#3B82F6)
5. Inactive sub-boards appear normal and do not accept clicks
6. When free move triggers, all open sub-boards are highlighted
7. Won sub-boards display a large X or O overlaying the cells
8. Won sub-board overlay uses the player's color (blue for X, red for O)
9. Drawn sub-boards have a greyed-out appearance
10. Last-move cell has a subtle amber indicator (P2)
11. All transitions are instant — no animations

## Technical Notes

- Active board highlighting: SubBoard reads `activeBoards` from store and applies CSS class conditionally
- Won overlay: SubBoardOverlay component renders absolutely positioned over the SubBoard grid
- Hover states: Use CSS `:hover` pseudo-class, only on empty cells in active boards
- Last-move indicator: Cell checks `lastMove` from store against its own boardIndex/cellIndex
