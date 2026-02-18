# Story S16: Implement last-move indicator

> **Epic:** E05-game-state-ui
> **Complexity:** S
> **Priority:** P2
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S15

## Description

Highlight the most recently placed mark with a subtle visual indicator so players can easily track what just happened. The indicator should be noticeable but not distracting — an amber-colored dot or ring around the last-played cell.

## Embedded Context

### From PRD

- **US-021 (P2):** As a player, I want to see the last move played with a subtle highlight so I can track the flow of the game.

### From Architecture

- **GameState.lastMove:** `{ board: BoardIndex, cell: CellIndex } | null`. Updated by the store on every valid `placeMove` call. Set to `null` in initial state.
- Cell component checks if its position (boardIndex, cellIndex) matches `lastMove` from the store.

### From UX Spec

- **Cell lastMove state:** Same mark rendering as filledX/filledO, but with an additional amber indicator (`#F59E0B`, amber-500).
- **Indicator style:** Subtle dot or ring — should complement the mark, not overpower it.

## Acceptance Criteria

1. **Given** a move was just placed, **When** the board renders, **Then** the cell where the move was placed has a subtle amber indicator (#F59E0B).
2. **Given** the next move is placed, **When** the board renders, **Then** the previous last-move indicator is removed and the new indicator appears on the newly placed cell.
3. **Given** initial game state (no moves played), **When** the board renders, **Then** no last-move indicator exists on any cell.

## Test Requirements

- [ ] Unit tests: Cell with matching lastMove coordinates has the last-move indicator CSS class.
- [ ] Unit tests: Cell without matching lastMove coordinates does not have the last-move indicator CSS class.
- [ ] Unit tests: After a new move, the previous last-move cell loses the indicator class.
- [ ] Integration tests: Placing a move updates the last-move indicator to the correct cell.

## Implementation Notes

- Add a Zustand selector in Cell: `useGameStore(state => state.lastMove)`.
- Compare `lastMove.board === boardIndex && lastMove.cell === cellIndex` to determine if this cell is the last move.
- Apply a conditional CSS class (e.g., `styles.lastMove`) that adds the amber indicator.
- Indicator options: a small dot in the corner of the cell, a ring/outline around the mark, or a subtle background tint. Choose whichever is most visually clean.
- Add `--color-last-move: #F59E0B` to design tokens in index.css.
- The indicator should use `box-shadow` or `outline` rather than changing the mark itself.

## Out of Scope

- Move history or undo functionality
- Animation on indicator appearance
