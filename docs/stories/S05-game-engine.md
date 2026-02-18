# Story S05: Implement game engine

> **Epic:** E02-game-logic (`docs/epics/E02-game-logic.md`)
> **Complexity:** L
> **Priority:** P0
> **File Ownership:** frontend (src/game/)
> **Dependencies:** S04

## Description

Create `src/game/engine.ts` containing pure functions for all game state transitions. The engine is the core of the game: it creates initial state, processes moves, detects sub-board wins/draws, detects meta-board wins/draws, and produces new immutable game states. All functions are pure (no side effects) and return new state objects rather than mutating existing ones.

## Embedded Context

### From PRD

**Functional Requirements:**
- **FR-010:** Players alternate turns, X always goes first.
- **FR-013:** When a player completes three in a row on a sub-board (any of 8 patterns), that sub-board is won by that player.
- **FR-014:** When a player wins three sub-boards in a row on the meta-board (any of 8 patterns), that player wins the game.
- **FR-015:** When all cells of a sub-board are filled with no three-in-a-row, the sub-board is a draw.
- **FR-016:** When all sub-boards are decided (won or drawn) with no player having three sub-boards in a row, the game is a draw.
- **FR-017:** Players cannot place marks on sub-boards that are already completed (won or drawn).
- **FR-018:** No moves are allowed after the game has ended (win or draw).

**User Stories:**
- **US-002:** As a player, I want to place my mark (X or O) in a valid cell so that my move is recorded correctly.
- **US-004:** As a player, I want the game to correctly alternate turns between X and O.
- **US-008:** As a player, I want to be notified when a sub-board is won or drawn so I understand the game progression.
- **US-009:** As a player, I want a free move (choose any open sub-board) when sent to a completed sub-board.
- **US-014:** As a player, I want to see the final result (win/draw) clearly when the game ends.

### From Architecture

**engine.ts Function Signatures:**

```typescript
/**
 * Creates a fresh game state with all cells empty, X to move, all boards active.
 */
function createInitialState(): GameState;

/**
 * Attempts to make a move. Returns a new state on success, or an error on failure.
 * This is the primary entry point — it validates the move, applies it,
 * checks for sub-board completion, checks for meta-board completion,
 * and determines the next active boards.
 */
function makeMove(state: GameState, board: BoardIndex, cell: CellIndex): MoveResult;

/**
 * Checks if a player has won a sub-board.
 * Returns the winning player or null.
 */
function checkSubBoardWin(cells: CellValue[]): Player | null;

/**
 * Checks if a sub-board is drawn (all cells filled, no winner).
 */
function checkSubBoardDraw(cells: CellValue[]): boolean;

/**
 * Checks if a player has won the meta-board (three sub-boards in a row).
 * Returns the winner and the winning line indices, or null.
 */
function checkMetaWin(statuses: SubBoardStatus[]): { winner: Player; line: BoardIndex[] } | null;

/**
 * Checks if the meta-board is drawn (all sub-boards decided, no winner).
 */
function checkMetaDraw(statuses: SubBoardStatus[]): boolean;
```

**GameState Data Model:**

```typescript
interface GameState {
  boards: CellValue[][];          // 9 sub-boards, each with 9 cells
  subBoardStatus: SubBoardStatus[]; // status of each sub-board
  currentPlayer: Player;           // 'X' or 'O'
  activeBoards: BoardIndex[] | 'all'; // which boards accept moves
  gameResult: GameResult | null;    // null while in progress
  lastMove: Move | null;           // most recent move
  winningLine: BoardIndex[] | null; // meta-board winning line
}
```

**Win Detection Patterns:**
```
WIN_PATTERNS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
```

**Error Handling:** Functions return `MoveResult` with `{ success: false, reason: string }` for invalid moves. No exceptions are thrown from engine functions.

**Active Board Rule:** After a move on cell index N, the next active board is board N. If board N is already completed (won or drawn), then `activeBoards` becomes `'all'` (free move).

### From Architecture (Data Flow)

```
User Click → Cell Component → gameStore.placeMove() → engine.makeMove() → new GameState → store update → React re-render
```

## Acceptance Criteria

1. **Given** no prior state, **When** `createInitialState()` is called, **Then** the returned state has all 81 cells as `null`, `currentPlayer` is `'X'`, `activeBoards` is `'all'`, `gameResult` is `null`, `lastMove` is `null`, `winningLine` is `null`, and all 9 `subBoardStatus` entries are `'in-progress'`.
2. **Given** a valid move on board 4 cell 2, **When** `makeMove(state, 4, 2)` is called, **Then** `boards[4][2]` is set to the current player's mark, `currentPlayer` flips to the other player, and `activeBoards` becomes `[2]` (assuming board 2 is still in-progress).
3. **Given** three X marks in a winning pattern on a sub-board (e.g., cells 0, 1, 2), **When** `checkSubBoardWin(cells)` is called, **Then** it returns `'X'`.
4. **Given** all 9 cells of a sub-board are filled with no three-in-a-row, **When** `checkSubBoardDraw(cells)` is called, **Then** it returns `true`.
5. **Given** three sub-boards won by X in a winning pattern (e.g., boards 0, 4, 8), **When** `checkMetaWin(statuses)` is called, **Then** it returns `{ winner: 'X', line: [0, 4, 8] }`.
6. **Given** all 9 sub-boards are decided (mix of won and drawn) with no player having three in a row, **When** `checkMetaDraw(statuses)` is called, **Then** it returns `true`.
7. **Given** a move targeting a completed sub-board, **When** `makeMove` is called, **Then** it returns `{ success: false, reason: '...' }` and state is unchanged.
8. **Given** `gameResult` is not `null` (game is over), **When** `makeMove` is called, **Then** it returns `{ success: false, reason: '...' }` and state is unchanged.

## Test Requirements

- [ ] Unit tests for each function — see S07 for comprehensive test story
- [ ] All functions are pure and testable in isolation
- [ ] Edge cases covered in S07: all 8 win patterns, draws, free moves, cascading free moves

## Implementation Notes

- All functions must be pure — take state in, return new state out. Never mutate the input `GameState`.
- Use spread operators or `structuredClone` for immutable updates on `boards` and `subBoardStatus` arrays.
- `makeMove` is the orchestrator function. Its logic flow:
  1. Check if game is already over → fail
  2. Check if the target board is in `activeBoards` → fail
  3. Check if the target cell is already occupied → fail
  4. Clone the state and apply the move
  5. Check if the sub-board is now won → update `subBoardStatus`
  6. Check if the sub-board is now drawn → update `subBoardStatus`
  7. Check if the meta-board is now won → set `gameResult` and `winningLine`
  8. Check if the meta-board is now drawn → set `gameResult`
  9. Determine next `activeBoards` based on `cell` index
  10. Flip `currentPlayer`
  11. Set `lastMove`
  12. Return `{ success: true, state: newState }`
- Export all functions as named exports for testability.

## Out of Scope

- Rule validation helpers as a separate module (S06)
- Zustand store integration (S08)
- React components and UI
- Move history / undo functionality
