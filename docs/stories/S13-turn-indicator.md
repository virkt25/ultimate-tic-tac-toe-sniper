# Story S13: Implement TurnIndicator component

> **Epic:** E05-game-state-ui
> **Complexity:** S
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S10

## Description

Create TurnIndicator.tsx that displays the current player's turn with color-coded text. Reads `currentPlayer` and `gameResult` from the Zustand store. Shows "Player X" in blue or "Player O" in red depending on whose turn it is.

## Embedded Context

### From PRD

- **FR-020:** Display a turn indicator showing which player's turn it is.
- **FR-021:** Update the turn indicator immediately after each valid move.
- **US-005:** As a player, I want to see whose turn it is at all times, visible without scrolling, so there is no confusion about the current state.

### From Architecture

- **TurnIndicator.tsx** — No props. Reads `currentPlayer` and `gameResult` from the Zustand game store using selectors.
- Positioned above the MetaBoard in the component hierarchy: Game > TurnIndicator + MetaBoard + GameStatusBar + GameOverOverlay.

### From UX Spec

- **TurnIndicator states:**
  - **playerX:** Displays "Player X" with blue text color (`--color-player-x`, #2563EB).
  - **playerO:** Displays "Player O" with red text color (`--color-player-o`, #DC2626).
  - **gameOver:** Displays result text (e.g., "Player X Wins!" or "Draw").
- **Typography:** Font size 18-20px, font-weight 600 (semi-bold).
- **Position:** Always visible above the board. Must not scroll off-screen.
- **Accessibility:** `aria-live="polite"` so screen readers announce turn changes without interrupting.

## Acceptance Criteria

1. **Given** initial game state (X goes first), **When** the TurnIndicator renders, **Then** it shows "Player X" in blue (#2563EB).
2. **Given** it is Player O's turn, **When** the TurnIndicator renders, **Then** it shows "Player O" in red (#DC2626).
3. **Given** a valid move is executed, **When** the turn changes, **Then** the TurnIndicator updates immediately to reflect the new current player.
4. **Given** any screen size, **When** the TurnIndicator renders, **Then** it is visible without scrolling (positioned above the board).

## Test Requirements

- [ ] Unit tests: TurnIndicator renders "Player X" when currentPlayer is 'X'.
- [ ] Unit tests: TurnIndicator renders "Player O" when currentPlayer is 'O'.
- [ ] Unit tests: TurnIndicator text updates when the store's currentPlayer changes.
- [ ] Integration tests: After a move is placed, the TurnIndicator reflects the new player.

## Implementation Notes

- Use a Zustand selector: `useGameStore(state => state.currentPlayer)` and `useGameStore(state => state.gameResult)`.
- Apply color via inline style or CSS Module class that references the design token custom property.
- The `aria-live="polite"` attribute goes on the containing element so assistive technology announces changes.
- Create `TurnIndicator.module.css` for styling (font-size, font-weight, text-align, color classes).
- Keep the component simple — it is purely a display component with no interactivity.

## Out of Scope

- Game-over state text display (S17 handles the GameOverOverlay)
- Detailed ARIA labeling and screen reader optimization (S24)
- Responsive font sizing (S20)
