# Story S04: Define game types and constants

> **Epic:** E02-game-logic (`docs/epics/E02-game-logic.md`)
> **Complexity:** S
> **Priority:** P0
> **File Ownership:** frontend (src/game/)
> **Dependencies:** S01

## Description

Create `src/game/types.ts` containing all TypeScript type definitions and constants needed for the Ultimate Tic-Tac-Toe game engine. This file defines the complete domain model: players, board state, move representation, game state, and win patterns. All subsequent game logic modules (engine, rules, store) depend on these types.

## Embedded Context

### From Architecture (Section 4.2 — Data Model)

**All type definitions to implement:**

```typescript
/** The two players */
export type Player = 'X' | 'O';

/** A cell can be occupied by a player or empty */
export type CellValue = Player | null;

/** Index for a sub-board on the meta-board (0-8, left-to-right, top-to-bottom) */
export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Index for a cell within a sub-board (0-8, left-to-right, top-to-bottom) */
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Status of an individual sub-board */
export type SubBoardStatus = 'in-progress' | 'won-x' | 'won-o' | 'draw';

/** Result of a completed game */
export type GameResult = { winner: Player } | { draw: true };

/** A move specifies which sub-board and which cell */
export type Move = { board: BoardIndex; cell: CellIndex };

/** Result of attempting a move */
export type MoveResult =
  | { success: true; state: GameState }
  | { success: false; reason: string };

/** Complete game state */
export interface GameState {
  /** 9 sub-boards, each containing 9 cells */
  boards: CellValue[][];
  /** Status of each sub-board */
  subBoardStatus: SubBoardStatus[];
  /** Whose turn it is */
  currentPlayer: Player;
  /** Which sub-boards accept moves — array of indices or 'all' */
  activeBoards: BoardIndex[] | 'all';
  /** Overall game result, null if game is in progress */
  gameResult: GameResult | null;
  /** The most recent move, null if no moves yet */
  lastMove: Move | null;
  /** Indices of sub-boards forming the winning line, null if no winner */
  winningLine: BoardIndex[] | null;
}
```

**Win patterns constant:**

```typescript
/**
 * All possible winning lines: 3 rows, 3 columns, 2 diagonals.
 * Used for both sub-board and meta-board win detection.
 * Indices map left-to-right, top-to-bottom:
 *   0 | 1 | 2
 *   ---------
 *   3 | 4 | 5
 *   ---------
 *   6 | 7 | 8
 */
export const WIN_PATTERNS: readonly [number, number, number][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];
```

**Board Index Mapping:**

The meta-board consists of 9 sub-boards arranged in a 3x3 grid. Each sub-board contains 9 cells also in a 3x3 grid. Both use the same indexing scheme:

```
 0 | 1 | 2
 ---------
 3 | 4 | 5
 ---------
 6 | 7 | 8
```

A move on cell N within any sub-board sends the opponent to sub-board N on the meta-board.

## Acceptance Criteria

1. **Given** `src/game/types.ts`, **When** imported in another TypeScript file, **Then** all types (`Player`, `CellValue`, `BoardIndex`, `CellIndex`, `SubBoardStatus`, `GameResult`, `Move`, `MoveResult`, `GameState`) and constants (`WIN_PATTERNS`) are available.
2. **Given** TypeScript strict mode is enabled, **When** the project is compiled with `tsc --noEmit`, **Then** no type errors are reported in `types.ts`.
3. **Given** `WIN_PATTERNS`, **When** inspected, **Then** it contains exactly 8 patterns: 3 rows, 3 columns, and 2 diagonals.
4. **Given** `BoardIndex` and `CellIndex` types, **When** a value outside 0-8 is assigned, **Then** TypeScript reports a compile-time error.

## Test Requirements

- [ ] Type compilation verification only (run `tsc --noEmit` and confirm no errors)
- [ ] No runtime unit tests needed — these are type definitions and a constant

## Implementation Notes

- This file is pure types and constants with no runtime logic. Keep it free of functions.
- Use `readonly` on `WIN_PATTERNS` to prevent mutation.
- Export everything as named exports (no default export).
- The `BoardIndex` and `CellIndex` union types restrict values to valid indices at compile time, catching off-by-one errors.
- `GameState.boards` is `CellValue[][]` — an array of 9 sub-boards, each being an array of 9 `CellValue` entries. At runtime, enforce that `boards.length === 9` and `boards[i].length === 9` in the engine, not here.

## Out of Scope

- Game engine functions (S05)
- Rule validation functions (S06)
- Zustand store (S08)
- Any runtime logic or validation
