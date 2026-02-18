# Story S19: Implement winning line indicator on meta-board

> **Epic:** E06-game-over
> **Complexity:** S
> **Priority:** P1
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S17

## Description

When the meta-board is won, visually indicate the three sub-boards that form the winning line. The game state exposes `winningLine` from `GameState`, which contains the three board indices that complete the winning row, column, or diagonal. The winning sub-boards receive additional visual emphasis, while non-winning sub-boards are de-emphasized. In the case of a draw, no winning line is shown.

## Embedded Context

### From PRD

- **US-010**: Winning three-in-a-row on the meta-board is visually indicated so the player can see which line won the game.

### From Architecture

- `GameState.winningLine`: typed as `BoardIndex[] | null`. When null, no winning line exists (game in progress or draw).
- `checkMetaWin` returns `{ winner: Player, line: BoardIndex[] }` where `line` is the three board indices (0-8) forming the winning row, column, or diagonal on the meta-board.

### From UX Spec

- **MetaBoard gameOver state**: The winning line of sub-boards is highlighted with visual emphasis.
- **MetaBoard prop**: `winningLine?: [row, col][]` — an array of up to three coordinate pairs identifying the winning sub-boards.
- Non-winning sub-boards should be visually de-emphasized (e.g., reduced opacity or muted styling) to draw attention to the winning line.

## Acceptance Criteria

1. **Given** Player X wins with boards [0, 4, 8] (diagonal), **When** the game-over state renders, **Then** those three sub-boards have an additional visual emphasis class (e.g., `winning`) applied to them.
2. **Given** the game ends in a draw, **When** the game-over state renders, **Then** no winning line highlight is shown on any sub-board.
3. **Given** a winning line exists, **When** the meta-board renders in game-over state, **Then** the non-winning sub-boards are visually de-emphasized (e.g., reduced opacity, muted colors).

## Test Requirements

- [ ] Unit tests: N/A (logic for winningLine is in game engine, covered by S17)
- [ ] Integration tests: Component test verifying that sub-boards in the winning line receive the emphasis CSS class (e.g., `.winning`), non-winning sub-boards receive a de-emphasis CSS class (e.g., `.dimmed`), and that a draw results in no winning line classes applied.

## Implementation Notes

- Read `winningLine` from the Zustand game store and pass it as a prop to `MetaBoard`.
- In `MetaBoard`, for each `SubBoard`, check if its board index is included in `winningLine`. If yes, apply a `winning` CSS Module class. If `winningLine` is non-null and the board is not in it, apply a `dimmed` class.
- Suggested CSS: `.winning` adds a border glow or background highlight; `.dimmed` reduces opacity to ~0.4.
- When `winningLine` is `null` (draw or game in progress), no emphasis/de-emphasis classes are applied.

## Out of Scope

- Winning line animation (e.g., drawing a line across the board)
- Winning celebration effects (confetti, sounds, etc.)
