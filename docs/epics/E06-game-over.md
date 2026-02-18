# Epic E06: Game Over & Controls

> **Status:** Draft
> **Priority:** P1
> **Estimated Points:** 9
> **Dependencies:** E05-game-state-ui

## Scope

### In Scope
- GameOverOverlay component (win and draw display)
- NewGameButton component (reset game state)
- Winning line indicator on meta-board
- Game-over freeze (no moves accepted after game ends)

### Out of Scope
- Confirmation dialog on New Game (explicitly excluded per UX spec)
- Animations or celebratory effects (out of scope per PRD)
- Game history or statistics (out of scope per PRD)

## Architecture Context

### GameOverOverlay Component (from UX Spec)
- **States:** `winX` ("Player X Wins!", blue), `winO` ("Player O Wins!", red), `draw` ("It's a Draw!", neutral)
- **Props:** Reads from store: `gameResult`, `onNewGame`
- **Behavior:** Modal-style overlay with backdrop (rgba(0,0,0,0.5)). Board visible underneath but dimmed.
- **Focus trap:** Focus cycles within overlay when visible. Auto-focus on "New Game" button.
- **Escape key:** Dismisses overlay (board remains frozen).
- **Typography:** 24-32px bold result text.

### NewGameButton Component
- Standard `<button>` with text "New Game"
- Calls `gameStore.newGame()` — resets to `createInitialState()`
- No page reload
- No confirmation dialog (per UX spec: Quick Competitor persona wants instant rematches)

### Winning Line
- `winningLine` field in GameState: `BoardIndex[] | null`
- When meta-board won, the three sub-boards forming the winning line get additional visual treatment
- `checkMetaWin` returns `{ winner: Player, line: BoardIndex[] }`

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S17 | Implement GameOverOverlay | M | S13, S15 | frontend |
| S18 | Implement NewGameButton and reset flow | S | S17 | frontend |
| S19 | Implement winning line indicator | S | S17 | frontend |

## Acceptance Criteria

1. When a player wins, an overlay displays "{Player X/O} Wins!" with correct color
2. When the game draws, the overlay displays "It's a Draw!"
3. The overlay has a semi-transparent backdrop dimming the board
4. "New Game" button is prominently visible in the overlay
5. Clicking "New Game" resets all game state to initial without page reload
6. After reset, Player X goes first and all boards are active
7. No moves are accepted after the game ends (board is frozen)
8. The winning three sub-boards on the meta-board are visually indicated
9. "New Game" button also appears below the board (not just in overlay)

## Technical Notes

- GameOverOverlay renders conditionally when `gameResult !== null`
- Use CSS `position: fixed` with `inset: 0` for full-viewport overlay
- Focus trap: after overlay appears, trap Tab key within the overlay content
- Escape key handler on the overlay to dismiss it
- Winning line: MetaBoard reads `winningLine` from store and passes a `isWinningBoard` prop to relevant SubBoards
