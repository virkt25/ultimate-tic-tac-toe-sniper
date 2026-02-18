# Story S06: Implement rule validation

> **Epic:** E02-game-logic (`docs/epics/E02-game-logic.md`)
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/game/)
> **Dependencies:** S04

## Description

Create `src/game/rules.ts` with pure functions for move validation and active board determination. These functions encapsulate the Ultimate Tic-Tac-Toe targeting rules: which boards are active, whether a specific move is legal, and how to compute the next active board after a move. The engine (S05) uses these functions internally, and the UI layer uses them to determine which cells are clickable.

## Embedded Context

### From PRD

**Functional Requirements:**
- **FR-011:** After a player moves in cell N of a sub-board, the opponent must play in sub-board N. This is the core "targeting" rule of Ultimate Tic-Tac-Toe.
- **FR-012:** If the targeted sub-board (board N) is already completed (won or drawn), the opponent gets a free move and may play in any non-completed sub-board.
- **FR-017:** Players cannot place marks on sub-boards that are already completed (won or drawn).
- **FR-023:** Non-active sub-boards visually reject input (no hover effects, clicks are no-ops).

**User Stories:**
- **US-002:** As a player, I want to place my mark in a valid cell so that my move is recorded correctly.
- **US-003:** As a player, I want to clearly see which sub-board I must play in so I know where to move.
- **US-009:** As a player, I want a free move when I am sent to a completed sub-board, so the game can continue.

### From Architecture

**rules.ts Function Signatures:**

```typescript
/**
 * Checks whether a move is valid given the current game state.
 * A move is valid when:
 * 1. The game is not over
 * 2. The target board is in the active boards list (or activeBoards is 'all')
 * 3. The target board is not completed
 * 4. The target cell is not already occupied
 */
function isValidMove(state: GameState, board: BoardIndex, cell: CellIndex): boolean;

/**
 * Returns the list of board indices that currently accept moves.
 * Used by the UI to highlight active boards and enable/disable interaction.
 */
function getActiveBoards(state: GameState): BoardIndex[];

/**
 * Determines the next active board(s) after a move on the given cell index.
 * If the target board (same index as cellIndex) is still in-progress,
 * returns [cellIndex]. If the target board is completed, returns 'all'
 * (free move).
 */
function getNextActiveBoard(
  cellIndex: CellIndex,
  subBoardStatuses: SubBoardStatus[]
): BoardIndex[] | 'all';
```

**Active Board Rule (detailed):**

The targeting rule is the defining mechanic of Ultimate Tic-Tac-Toe:

1. **Standard targeting:** When a player places a mark in cell N of any sub-board, the opponent must next play in sub-board N.
2. **Free move:** If sub-board N is already completed (status is `'won-x'`, `'won-o'`, or `'draw'`), then the opponent may play in any sub-board that is still `'in-progress'`. This is represented as `activeBoards: 'all'`, but the UI and validation still reject completed boards.
3. **First move:** At the start of the game, `activeBoards` is `'all'` — X may play anywhere.

**`getActiveBoards` expansion logic:**
- If `state.activeBoards` is `'all'`, return all board indices where `subBoardStatus[i] === 'in-progress'`.
- If `state.activeBoards` is an array, return that array as-is (the engine already ensures these boards are valid).

## Acceptance Criteria

1. **Given** `activeBoards` is `[4]`, **When** `isValidMove(state, 4, 0)` is called for an empty cell, **Then** it returns `true`.
2. **Given** `activeBoards` is `[4]`, **When** `isValidMove(state, 3, 0)` is called, **Then** it returns `false` (board 3 is not active).
3. **Given** `activeBoards` is `'all'`, **When** `isValidMove(state, 7, 5)` is called for an empty cell on an in-progress board, **Then** it returns `true`.
4. **Given** a move on cell 7, **When** `getNextActiveBoard(7, statuses)` is called and `statuses[7]` is `'in-progress'`, **Then** it returns `[7]`.
5. **Given** a move on cell 3, **When** `getNextActiveBoard(3, statuses)` is called and `statuses[3]` is `'won-x'`, **Then** it returns `'all'`.
6. **Given** a cell that is already occupied, **When** `isValidMove` is called for that cell, **Then** it returns `false`.
7. **Given** `gameResult` is not `null`, **When** `isValidMove` is called for any cell, **Then** it returns `false`.
8. **Given** `activeBoards` is `'all'` and boards 0, 3, 5 are completed, **When** `getActiveBoards(state)` is called, **Then** it returns `[1, 2, 4, 6, 7, 8]` (only in-progress boards).

## Test Requirements

- [ ] Unit tests for `isValidMove` — see S07 for comprehensive tests
- [ ] Unit tests for `getActiveBoards` — see S07
- [ ] Unit tests for `getNextActiveBoard` — see S07

## Implementation Notes

- All functions are pure — no side effects, no mutations.
- `isValidMove` should check conditions in order: game over, board active, board completed, cell occupied. Return `false` at the first failing condition.
- `getActiveBoards` is a convenience function for the UI. When `activeBoards` is `'all'`, it filters out completed boards and returns the remaining indices.
- `getNextActiveBoard` is called by the engine during `makeMove` to set the next state's `activeBoards`. It only needs the cell index and the current sub-board statuses.
- Export all functions as named exports.

## Out of Scope

- Game engine state transitions (S05)
- Zustand store (S08)
- UI components that use these functions for rendering
- Move history or undo
