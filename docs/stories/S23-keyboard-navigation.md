# Story S23: Implement keyboard navigation and focus management

> **Epic:** E08-accessibility
> **Complexity:** L
> **Priority:** P1
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S14, S15

## Description

Make the entire Ultimate Tic-Tac-Toe game fully playable via keyboard alone. Implement arrow key navigation within the active sub-board, Enter/Space to place a mark, Tab to move between page regions, Escape to dismiss the game-over overlay, and automatic focus management that moves focus to the correct cell after each move. This ensures keyboard-only users can play the game without needing a mouse or touch input.

## Embedded Context

### From PRD

- **NFR**: The game must be keyboard accessible using Tab and Enter at minimum.
- **US-002**: As a player, I can place X and O marks in cells, which must be achievable via keyboard.

### From Architecture

- React 18+ with TypeScript strict mode.
- Zustand store holds all game state including `activeBoard`, `boards`, `currentPlayer`, and `gameStatus`.
- Components: `MetaBoard`, `SubBoard`, `Cell`, `TurnIndicator`, `NewGameButton`, `GameOverOverlay`.

### From UX Spec

**Tab order** (sequential navigation with Tab key):
1. `TurnIndicator` (read-only, receives focus for screen reader context but not interactive)
2. Active cells in reading order (left-to-right, top-to-bottom within the active sub-board)
3. `NewGameButton`

**Arrow key navigation** within the active sub-board:
- Up arrow: move focus up one row (index - 3), wrap to bottom if at top
- Down arrow: move focus down one row (index + 3), wrap to top if at bottom
- Left arrow: move focus left one column (index - 1), wrap to end of previous row or bottom-right if at top-left
- Right arrow: move focus right one column (index + 1), wrap to start of next row or top-left if at bottom-right
- Arrow navigation wraps within the 3x3 sub-board boundaries

**Mark placement**:
- Enter key: places the current player's mark on the focused cell (if empty and active)
- Space key: places the current player's mark on the focused cell (if empty and active)

**Game-over overlay**:
- Escape key: dismisses the game-over overlay and returns focus to the New Game button
- Focus trap: Tab cycles between the game result message and the New Game button within the overlay (focus does not leave the overlay while it is open)

**Automatic focus management after moves**:
- After a mark is placed and the game state updates, focus moves to the first empty cell (in reading order) of the newly active sub-board.
- If the newly active sub-board has no empty cells (should not normally happen as full boards are resolved), focus moves to the New Game button.
- If `activeBoard` is `null` (any board is playable), focus moves to the first empty cell of the first non-resolved board in reading order.

**Cell tabindex values**:
- `tabindex="0"`: cell is in the active sub-board and is empty (focusable and in tab order)
- `tabindex="-1"`: cell is not active, or cell is already filled (focusable via script but not in tab order)

## Acceptance Criteria

1. **Given** the active sub-board has focus, **When** the user presses arrow keys (Up, Down, Left, Right), **Then** focus moves between cells within that sub-board following the 3x3 grid pattern with wrapping.
2. **Given** an empty cell in the active sub-board is focused, **When** the user presses Enter, **Then** the current player's mark is placed in that cell.
3. **Given** an empty cell in the active sub-board is focused, **When** the user presses Space, **Then** the current player's mark is placed in that cell.
4. **Given** a mark was just placed and the game state has updated with a new active board, **When** the component re-renders, **Then** focus moves automatically to the first empty cell of the newly active sub-board.
5. **Given** the game-over overlay is displayed, **When** the user presses Tab, **Then** focus cycles within the overlay between the result text and the New Game button (focus trap).
6. **Given** the game-over overlay is displayed, **When** the user presses Escape, **Then** the overlay is dismissed and focus moves to the New Game button.
7. **Given** the user uses only keyboard input (no mouse or touch), **When** playing from the first move to game-over, **Then** the entire game is completable including placing marks, seeing results, and starting a new game.

## Test Requirements

- [ ] Unit tests: Test `onKeyDown` handler logic: arrow keys compute correct next focus index with wrapping, Enter/Space trigger `makeMove`, Escape on overlay calls dismiss handler.
- [ ] Integration tests: Component tests verifying: pressing arrow keys moves `document.activeElement` to the correct cell, pressing Enter on a focused cell updates the board state, after a move focus is on the correct cell in the new active sub-board, Tab within game-over overlay cycles correctly, Escape dismisses overlay and focuses New Game button.

## Implementation Notes

- Add an `onKeyDown` handler on the `MetaBoard` container element (or a wrapper div) to capture keyboard events via event delegation.
- For arrow navigation in a 3x3 grid:
  - Up: `newIndex = (currentIndex - 3 + 9) % 9`
  - Down: `newIndex = (currentIndex + 3) % 9`
  - Left: `newIndex = (currentIndex - 1 + 9) % 9`
  - Right: `newIndex = (currentIndex + 1) % 9`
  - Skip filled cells when navigating (move to next empty cell in that direction).
- Use React `useRef` to maintain references to all cell DOM elements for programmatic focus management. Consider a `Map<string, HTMLElement>` keyed by `${boardIndex}-${cellIndex}`.
- After the Zustand store updates with a new `activeBoard`, use a `useEffect` hook watching `activeBoard` to focus the first empty cell of the new active sub-board.
- For the focus trap in the game-over overlay, track the first and last focusable elements. On Tab at the last element, focus the first; on Shift+Tab at the first, focus the last.
- Prevent default browser behavior for Space (scroll) and arrow keys (scroll) when the game board has focus by calling `event.preventDefault()` in the `onKeyDown` handler.
- Ensure `event.preventDefault()` is only called for handled keys to avoid blocking other keyboard shortcuts.

## Out of Scope

- Screen reader announcements and ARIA attributes (S24)
- ARIA live regions for state changes (S24)
- High contrast mode support
