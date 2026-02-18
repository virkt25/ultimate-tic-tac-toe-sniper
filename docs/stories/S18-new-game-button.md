# Story S18: Implement NewGameButton and reset flow

> **Epic:** E06-game-over
> **Complexity:** S
> **Priority:** P1
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S17

## Description

Create NewGameButton.tsx that resets all game state when clicked by calling `gameStore.newGame()`. The button appears in two locations: inside the GameOverOverlay (primary placement) and in the game status bar below the board (always accessible). No confirmation dialog is shown — the reset is immediate to support the Quick Competitor persona's need for instant rematches.

## Embedded Context

### From PRD

- **FR-033:** The New Game button resets all state without requiring a page reload.
- **US-006:** As a player, I want instant rematches so I can start over without friction or delay.
- **Scope decision:** No confirmation dialog. The Quick Competitor persona values speed over safeguards.

### From Architecture

- **NewGameButton.tsx** — No props. Calls `gameStore.newGame()` on click.
- **`newGame()` action** in the Zustand store calls `createInitialState()` to produce a fresh state object and replaces the entire store state.
- **`createInitialState()`** returns: all 9 boards empty, currentPlayer = 'X', activeBoards = [0..8], gameResult = null, lastMove = null.

### From UX Spec

- **NewGameButton states:**
  - **default:** Standard button appearance.
  - **hover:** Subtle hover effect (background color change).
  - **active:** Pressed/depressed visual feedback.
  - **focus:** Visible focus ring (2px+ solid outline) for keyboard accessibility.
- **Element:** Standard `<button>` element with text content "New Game".
- **No confirmation dialog:** Reset is immediate on click. This is a deliberate design decision.
- **Placement:** Appears in the GameOverOverlay (auto-focused) and in the game status bar below the board (always visible during gameplay).

## Acceptance Criteria

1. **Given** the game is over, **When** the New Game button is clicked, **Then** all game state resets to initial values (empty boards, Player X's turn, all boards active, no game result).
2. **Given** state has been reset, **When** the board renders, **Then** all 81 cells are empty, it is Player X's turn, and all 9 boards are active.
3. **Given** state has been reset, **When** the reset completes, **Then** no page reload occurs (the app remains mounted).
4. **Given** the New Game button, **When** focused via keyboard (Tab), **Then** a visible focus ring (2px+ solid outline) appears around the button.
5. **Given** a game in progress (not yet over), **When** the New Game button in the status bar is clicked, **Then** the game resets immediately with no confirmation dialog.

## Test Requirements

- [ ] Unit tests: Clicking NewGameButton calls gameStore.newGame().
- [ ] Unit tests: After newGame() is called, store state matches createInitialState() output.
- [ ] Unit tests: All boards are empty after reset.
- [ ] Unit tests: currentPlayer is 'X' after reset.
- [ ] Unit tests: activeBoards contains all 9 indices after reset.
- [ ] Integration tests: Clicking New Game during a game in progress resets the board without confirmation.
- [ ] Integration tests: Clicking New Game from the GameOverOverlay resets the board and removes the overlay.

## Implementation Notes

- The component is simple: `<button onClick={() => gameStore.newGame()}>New Game</button>`.
- Create `NewGameButton.module.css` for button styles.
- Focus ring: use `:focus-visible` selector with `outline: 2px solid var(--color-player-x)` or a neutral color.
- The button should use `type="button"` explicitly (not `type="submit"`) to avoid accidental form submissions.
- The same NewGameButton component is rendered in two places — no need for separate components.
- The status bar placement means this button is accessible even mid-game, allowing players to restart at any time.
- `newGame()` store action implementation: `set(() => createInitialState())` using Zustand's `set` with a replacer function.

## Out of Scope

- Confirmation dialogs or undo
- Game history or statistics tracking
- Keyboard shortcut for new game (e.g., Ctrl+N)
