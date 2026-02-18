# Story S24: Add ARIA attributes and screen reader support

> **Epic:** E08-accessibility
> **Complexity:** M
> **Priority:** P1
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S23

## Description

Add all required ARIA attributes to game components and create `aria-live` regions for screen reader announcements. Screen readers must announce turn changes, sub-board wins, and game outcomes so that visually impaired players can follow the game state without visual cues. Every interactive element must have descriptive ARIA labels.

## Embedded Context

### From PRD

- **NFR**: The game must meet WCAG 2.1 AA standards including proper ARIA labeling and screen reader compatibility.
- Game state changes (turns, wins, draws) must be perceivable by assistive technology.

### From Architecture

- React 18+ with TypeScript strict mode.
- Components: `MetaBoard`, `SubBoard`, `Cell`, `TurnIndicator`, `GameOverOverlay`, `SubBoardOverlay`.
- Zustand store provides `currentPlayer`, `boards`, `activeBoard`, `gameStatus`, `winner`.
- No external accessibility libraries; use native ARIA attributes in JSX.

### From UX Spec

**ARIA attributes per component:**

| Component | Attribute | Value |
|---|---|---|
| MetaBoard | `role` | `"grid"` |
| MetaBoard | `aria-label` | `"Ultimate Tic-Tac-Toe game board"` |
| SubBoard | `role` | `"group"` |
| SubBoard | `aria-label` | `"Sub-board row {r} column {c}, {status}"` where status is "in progress", "won by X", "won by O", or "draw" |
| SubBoard (active) | `aria-description` | `"Your turn - select a cell in this board"` |
| Cell (empty, active) | `role` | `"button"` |
| Cell | `aria-label` | `"Row {r} column {c}, {empty\|X\|O}"` |
| Cell (inactive/filled) | `aria-disabled` | `"true"` |
| TurnIndicator | `aria-live` | `"polite"` |
| GameOverOverlay | `role` | `"dialog"` |
| GameOverOverlay | `aria-modal` | `"true"` |
| GameOverOverlay | `aria-label` | `"Game over"` |
| SubBoardOverlay | `aria-hidden` | `"true"` |

**Screen reader announcements via `aria-live` regions:**

- **Turn changes**: An `aria-live="polite"` region updates its text content to announce the current player's turn (e.g., "Player X's turn" or "Player O's turn"). This fires after every move.
- **Sub-board wins**: An `aria-live="polite"` region announces when a sub-board is won (e.g., "Player X won sub-board row 1 column 2"). This fires when a sub-board's status changes to won.
- **Game over**: An `aria-live="assertive"` region announces the final game result (e.g., "Game over. Player X wins!" or "Game over. It's a draw!"). Assertive priority ensures it interrupts any current announcement.

## Acceptance Criteria

1. **Given** the MetaBoard component, **When** inspected with a screen reader or accessibility tool, **Then** it has `role="grid"` and `aria-label="Ultimate Tic-Tac-Toe game board"`.
2. **Given** an active SubBoard, **When** inspected, **Then** it has `role="group"`, an `aria-label` including its row/column position and status, and `aria-description="Your turn - select a cell in this board"`.
3. **Given** an empty cell in the active sub-board, **When** inspected, **Then** it has `role="button"` and an `aria-label` describing its row, column, and empty state (e.g., "Row 1 column 2, empty").
4. **Given** a turn change occurs (a mark is placed), **When** the turn updates, **Then** the `aria-live="polite"` region updates and a screen reader announces the new current player's turn.
5. **Given** a sub-board is won by a player, **When** the sub-board status changes, **Then** the `aria-live="polite"` region announces which player won which sub-board (e.g., "Player X won sub-board row 1 column 2").
6. **Given** the game ends (win or draw), **When** the game-over state is reached, **Then** the `aria-live="assertive"` region announces the result (e.g., "Game over. Player X wins!" or "Game over. It's a draw!").

## Test Requirements

- [ ] Unit tests: Verify that ARIA attributes are correctly set on rendered components: MetaBoard has `role="grid"`, SubBoard has `role="group"` with correct `aria-label`, active SubBoard has `aria-description`, Cell has correct `role` and `aria-label`, GameOverOverlay has `role="dialog"` and `aria-modal="true"`.
- [ ] Integration tests: Component tests verifying that `aria-live` region text content updates on turn change, sub-board win, and game over. Use RTL `getByRole` and `getByText` to assert live region content.

## Implementation Notes

- Create a visually hidden `<div>` with `aria-live="polite"` for turn changes and sub-board wins. Use CSS to visually hide it (clip pattern: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;`).
- Create a separate visually hidden `<div>` with `aria-live="assertive"` for game-over announcements only. Keeping them separate ensures the assertive announcement is not queued behind polite ones.
- Update the polite live region's text content using a `useEffect` that watches `currentPlayer` for turn changes and `boards` for sub-board win status changes.
- Update the assertive live region's text content using a `useEffect` that watches `gameStatus` and `winner`.
- For SubBoard `aria-label`, compute status from the board's winner state: `null` = "in progress", `'X'` = "won by X", `'O'` = "won by O", `'draw'` = "draw".
- Row and column numbers in ARIA labels should be 1-indexed (not 0-indexed) for human readability.
- The `SubBoardOverlay` (showing X, O, or draw icon over a resolved sub-board) gets `aria-hidden="true"` because the SubBoard's own `aria-label` already communicates the result.

## Out of Scope

- High contrast mode and forced-colors media query support
- Custom screen reader instructions or help dialogs
- Automated accessibility testing integration (axe-core, etc.)
