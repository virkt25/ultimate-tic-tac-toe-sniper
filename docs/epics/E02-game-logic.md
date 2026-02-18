# Epic E02: Game Logic Core

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 20
> **Dependencies:** E01-foundation

## Scope

### In Scope
- All game type definitions (Player, CellValue, BoardIndex, GameState, etc.)
- Game engine: move execution, state transitions, win/draw detection
- Rule validation: move legality, active board determination, free moves
- Comprehensive unit tests covering all edge cases
- Win detection patterns for sub-boards and meta-board
- Draw detection for sub-boards and meta-board

### Out of Scope
- Zustand store wrapper (E03)
- React components or UI rendering (E04-E06)
- Responsive layout or mobile concerns (E07)
- Any browser/DOM dependencies — this layer is pure TypeScript

## Architecture Context

### Game Logic Layer (`src/game/`)

Pure TypeScript with zero React or DOM dependencies.

#### `types.ts` — Type Definitions
- Exports: `Player`, `CellValue`, `SubBoardStatus`, `GameState`, `MoveResult`, `BoardIndex`, `CellIndex`, `Move`, `GameResult`

#### `engine.ts` — Game Engine
- `createInitialState(): GameState`
- `makeMove(state: GameState, board: BoardIndex, cell: CellIndex): MoveResult`
- `checkSubBoardWin(board: CellValue[]): Player | null`
- `checkSubBoardDraw(board: CellValue[], status: SubBoardStatus): boolean`
- `checkMetaWin(statuses: SubBoardStatus[]): { winner: Player, line: BoardIndex[] } | null`
- `checkMetaDraw(statuses: SubBoardStatus[]): boolean`

#### `rules.ts` — Rule Validation
- `isValidMove(state: GameState, board: BoardIndex, cell: CellIndex): boolean`
- `getActiveBoards(state: GameState): BoardIndex[]`
- `getNextActiveBoard(cellIndex: CellIndex, subBoardStatuses: SubBoardStatus[]): BoardIndex[] | 'all'`

### Data Models

| Field | Type | Constraints |
|-------|------|------------|
| `boards` | `CellValue[][]` | 9 arrays of 9 elements each |
| `subBoardStatus` | `SubBoardStatus[]` | 9 elements: `'in-progress' \| 'won-x' \| 'won-o' \| 'draw'` |
| `currentPlayer` | `Player` | `'X' \| 'O'` |
| `activeBoards` | `number[] \| 'all'` | Board indices or `'all'` for free move |
| `gameResult` | `GameResult \| null` | `{ winner: Player } \| { draw: true } \| null` |
| `lastMove` | `Move \| null` | `{ board: BoardIndex, cell: CellIndex }` |
| `winningLine` | `BoardIndex[] \| null` | Three board indices forming the winning line |

### Win Detection Patterns

```
Rows:      [0,1,2], [3,4,5], [6,7,8]
Columns:   [0,3,6], [1,4,7], [2,5,8]
Diagonals: [0,4,8], [2,4,6]
```

### Board Index Mapping

```
Meta-board:               Sub-board cells:
┌───┬───┬───┐             ┌───┬───┬───┐
│ 0 │ 1 │ 2 │             │ 0 │ 1 │ 2 │
├───┼───┼───┤             ├───┼───┼───┤
│ 3 │ 4 │ 5 │             │ 3 │ 4 │ 5 │
├───┼───┼───┤             ├───┼───┼───┤
│ 6 │ 7 │ 8 │             │ 6 │ 7 │ 8 │
└───┴───┴───┘             └───┴───┴───┘
```

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S04 | Define game types and constants | S | S01 | frontend |
| S05 | Implement game engine | L | S04 | frontend |
| S06 | Implement rule validation | M | S04 | frontend |
| S07 | Comprehensive game logic tests | M | S05, S06 | tests |

## Acceptance Criteria

1. All game types compile under TypeScript strict mode
2. `makeMove` correctly places marks and transitions state
3. Sub-board win detection catches all 8 patterns (3 rows, 3 columns, 2 diagonals)
4. Meta-board win detection works identically using sub-board statuses
5. Draw detection for sub-boards (all cells filled, no winner) works correctly
6. Meta-board draw detection (no three-in-a-row possible) works correctly
7. Free move triggers when target sub-board is completed
8. Invalid moves (wrong board, filled cell, game over) return failure
9. 100% unit test coverage on `engine.ts` and `rules.ts`
10. All functions are pure — no side effects, no mutation

## Technical Notes

- All functions must be pure: `(state, input) => newState`. Never mutate the input state.
- Use spread operators or `structuredClone` to create new state objects.
- The `makeMove` function should orchestrate: validate → place mark → check sub-board → check meta → determine next active → return new state.
- Meta-board draw detection: simplest approach is to check if all sub-boards are decided AND no player has three in a row.
- Test edge cases: tied sub-board that triggers free move, cascading free moves, game ending on a free move, all 9 sub-boards drawn.
