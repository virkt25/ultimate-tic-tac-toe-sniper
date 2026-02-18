# Story S17: Implement GameOverOverlay

> **Epic:** E06-game-over
> **Complexity:** M
> **Priority:** P1
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S13, S15

## Description

Create GameOverOverlay.tsx that displays the game result (win or draw) with a semi-transparent backdrop over the board. The board remains visible underneath but dimmed. The overlay implements a focus trap to keep keyboard navigation within it, auto-focuses the New Game button, and supports Escape key to dismiss the overlay (while keeping the board frozen).

## Embedded Context

### From PRD

- **FR-032:** Display the game result clearly when the meta-game is decided (win or draw).
- **US-006:** As a player, I want to start a new game immediately after one ends so I can rematch without friction.
- **US-010:** As a player, I want a clear game-over state with the winner displayed so there is no ambiguity about the result.
- **US-014:** As a player, I want draw detection displayed so I know when neither player has won.

### From Architecture

- **GameOverOverlay.tsx** — No props. Reads `gameResult` from the Zustand game store.
- Renders conditionally: only when `gameResult !== null`.
- Contains a NewGameButton component (implemented in S18).
- The overlay does not modify game state — it is purely a display and interaction layer.

### From UX Spec

- **GameOverOverlay states:**
  - **winX:** Displays "Player X Wins!" with blue accent color (`--color-player-x`, #2563EB).
  - **winO:** Displays "Player O Wins!" with red accent color (`--color-player-o`, #DC2626).
  - **draw:** Displays "It's a Draw!" with neutral text color.
- **Accessibility:**
  - `role="dialog"` on the overlay container.
  - `aria-modal="true"` to indicate it blocks interaction with content behind it.
  - `aria-label="Game over"` for screen reader context.
- **Focus management:**
  - Focus is trapped within the overlay (Tab cycles through overlay elements only).
  - Auto-focus on the New Game button when the overlay appears.
  - Escape key dismisses the overlay (hides it), but the board remains frozen (game state unchanged).
- **Typography:** Result text is 24-32px, font-weight bold.
- **Backdrop:** `rgba(0, 0, 0, 0.5)` — semi-transparent black overlay covering the entire viewport.
- **Board underneath:** Visible but dimmed through the backdrop.
- **Appearance:** Immediate render (subtle 150ms fade-in is acceptable but not required).

## Acceptance Criteria

1. **Given** X wins the meta-game, **When** the GameOverOverlay renders, **Then** it shows "Player X Wins!" with blue accent text.
2. **Given** the meta-game ends in a draw, **When** the GameOverOverlay renders, **Then** it shows "It's a Draw!" with neutral text.
3. **Given** game over, **When** the overlay renders, **Then** the board is visible but dimmed behind a semi-transparent backdrop.
4. **Given** the overlay is visible, **When** the Tab key is pressed, **Then** focus cycles only within the overlay (focus trap).
5. **Given** the overlay is visible, **When** the Escape key is pressed, **Then** the overlay dismisses but the board remains frozen (no moves possible).
6. **Given** the overlay appears, **When** it first renders, **Then** the New Game button has focus automatically.

## Test Requirements

- [ ] Unit tests: GameOverOverlay renders "Player X Wins!" when gameResult indicates X won.
- [ ] Unit tests: GameOverOverlay renders "Player O Wins!" when gameResult indicates O won.
- [ ] Unit tests: GameOverOverlay renders "It's a Draw!" when gameResult indicates a draw.
- [ ] Unit tests: GameOverOverlay does not render when gameResult is null.
- [ ] Unit tests: Overlay has role="dialog" and aria-modal="true".
- [ ] Integration tests: Focus trap keeps Tab cycling within the overlay.
- [ ] Integration tests: Escape key hides the overlay while game state remains unchanged.
- [ ] Integration tests: New Game button receives focus on overlay mount.

## Implementation Notes

- Use `position: fixed; inset: 0; z-index: 100;` for the backdrop to cover the full viewport.
- The overlay content (result text + New Game button) should be centered within the backdrop using flexbox.
- Focus trap implementation: listen for `keydown` on Tab and Escape. Track first and last focusable elements. On Tab at the last element, redirect focus to the first. On Shift+Tab at the first element, redirect to the last.
- Auto-focus: use `useEffect` with a ref to the New Game button, calling `.focus()` on mount.
- Escape handling: maintain a local `dismissed` state. When Escape is pressed, set `dismissed = true` to hide the overlay. The game state (`gameResult`) remains non-null, so the board stays frozen.
- Create `GameOverOverlay.module.css` for backdrop, content positioning, and typography styles.
- The New Game button is rendered as a placeholder here and fully implemented in S18.

## Out of Scope

- Winning line indicator across the meta-board (S19)
- Game reset logic (S18 handles the NewGameButton and reset flow)
- Complex animations or celebration effects
