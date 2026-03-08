# Architecture Plan: Ultimate Tic-Tac-Toe

**Date:** 2026-03-07
**Artifact:** SNPR-20260307-c1a9

---

## Context

A two-player hot-seat Ultimate Tic-Tac-Toe web game. A 3x3 meta-grid of 3x3 tic-tac-toe boards (81 total cells). Purely client-side, no backend. Built with React + Vite + TypeScript + Tailwind CSS. Game state persisted to localStorage. Desktop/tablet primary targets.

Key gameplay rules: the cell you play in determines which board your opponent must play next. If sent to a decided/full board, the opponent gets a free move (any open board). Game ends when someone wins three boards in a row on the meta-grid, or all boards are decided with no meta-winner (draw).

---

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Game logic as pure functions, separate from React** | Testable without rendering. The reducer calls pure functions that take state and return new state. |
| 2 | **Single `useReducer` for all game state** | One source of truth. Actions: `PLAY_CELL`, `NEW_GAME`. Reducer is the only place state transitions happen. |
| 3 | **Board indices use flat 0-8 addressing** | Both the meta-grid and each small board use indices 0-8 (row-major). A cell is identified by `(boardIndex, cellIndex)`. Simpler than 2D coordinates. |
| 4 | **Derive display state, don't store it** | "Is this cell valid?" and "which boards are highlighted?" are computed from game state, not stored. Avoids stale derived state. |
| 5 | **localStorage sync via `useEffect`** | Serialize full game state to localStorage after every reducer dispatch. On mount, hydrate from localStorage if present. |
| 6 | **Win checking uses hardcoded line indices** | There are exactly 8 winning lines in a 3x3 grid. A constant array of `[number, number, number][]` is checked — no clever algorithms needed. |

---

## Components

```
App
├── GameHeader              — Turn indicator (X/O), game status (in progress / winner / draw)
├── MetaBoard               — 3x3 grid of SmallBoard components
│   └── SmallBoard (x9)     — Single 3x3 board; shows cells or winner overlay
│       └── Cell (x9 each)  — Single clickable cell; displays X, O, or empty
└── GameControls            — "New Game" button
```

**Responsibilities:**

- **App** — Owns `useReducer(gameReducer, initialState)`. Passes state + dispatch down. Handles localStorage hydration/persistence.
- **GameHeader** — Pure display. Receives `currentPlayer`, `winner`, `isDraw`.
- **MetaBoard** — Maps over 9 boards, passes board data + active/highlight state to each SmallBoard.
- **SmallBoard** — Renders 3x3 grid of Cells. When the board is won, renders a large X/O overlay instead of individual cells. When tied, renders greyed-out overlay with reduced opacity.
- **Cell** — Handles click events. Receives `value` (X/O/null), `isValid` (can be clicked), `onPlay` callback.
- **GameControls** — Dispatches `NEW_GAME` action.

---

## Data Model

```typescript
type Player = 'X' | 'O';
type CellValue = Player | null;
type BoardResult = Player | 'draw' | null; // null = still in play

interface GameState {
  // Board data: 9 small boards, each with 9 cells
  boards: CellValue[][]; // boards[boardIndex][cellIndex], length 9x9

  // Result of each small board (won by X, won by O, draw, or still in play)
  boardResults: BoardResult[]; // length 9

  // Which board the current player must play in (null = free move)
  activeBoardIndex: number | null;

  // Whose turn it is
  currentPlayer: Player;

  // Game-level outcome
  winner: Player | null;
  isDraw: boolean;
}

type GameAction =
  | { type: 'PLAY_CELL'; boardIndex: number; cellIndex: number }
  | { type: 'NEW_GAME' };
```

---

## File Structure

```
src/
├── main.tsx                    — React entry point, renders App
├── App.tsx                     — Root component, reducer + localStorage
├── components/
│   ├── GameHeader.tsx          — Turn/status display
│   ├── MetaBoard.tsx           — 3x3 grid of SmallBoards
│   ├── SmallBoard.tsx          — Single board with cells or overlay
│   ├── Cell.tsx                — Single cell button
│   └── GameControls.tsx        — New Game button
├── game/
│   ├── reducer.ts              — gameReducer function
│   ├── logic.ts                — Pure game logic functions
│   ├── types.ts                — TypeScript types (GameState, etc.)
│   └── constants.ts            — WIN_LINES, initial state factory
├── hooks/
│   └── useLocalStorage.ts      — localStorage hydration/persistence
├── index.css                   — Tailwind directives + any custom CSS
index.html                      — Vite HTML entry
tailwind.config.js
tsconfig.json
vite.config.ts
vitest.config.ts (or inline in vite.config.ts)
package.json
```

Test files live adjacent to their source: `src/game/logic.test.ts`, `src/game/reducer.test.ts`.

---

## State Flow

### Move lifecycle

```
User clicks Cell
  → Cell calls onPlay(boardIndex, cellIndex)
    → App dispatches { type: 'PLAY_CELL', boardIndex, cellIndex }
      → gameReducer calls logic functions:
         1. validateMove(state, boardIndex, cellIndex) — is this legal?
         2. placeCell(state, boardIndex, cellIndex)    — new boards array
         3. checkBoardResult(board)                    — did this board get won/drawn?
         4. checkGameResult(boardResults)              — did the meta-game end?
         5. getNextActiveBoard(cellIndex, boardResults) — where must next player go?
         6. Return new GameState
      → React re-renders with new state
      → useEffect persists to localStorage
```

### Key logic functions (in `logic.ts`)

- `validateMove(state, boardIndex, cellIndex): boolean` — Checks: game not over, correct active board (or free move), cell is empty, board not decided.
- `checkBoardResult(board: CellValue[]): BoardResult` — Checks 8 win lines, then checks if board is full (draw), else null.
- `checkGameResult(boardResults: BoardResult[]): { winner: Player | null; isDraw: boolean }` — Same win-line check on `boardResults`. Draw if all 9 boards decided and no winner.
- `getNextActiveBoard(cellIndex: number, boardResults: BoardResult[]): number | null` — If `boardResults[cellIndex]` is non-null (decided board), return null (free move). Else return `cellIndex`.

### Derived display state (computed in components, not stored)

- **Valid cells:** A cell at `(b, c)` is valid if: game not over, `boardResults[b]` is null, `boards[b][c]` is null, and (`activeBoardIndex` is null or `activeBoardIndex === b`).
- **Highlighted boards:** If `activeBoardIndex` is non-null, highlight that board. If null (free move), highlight all undecided boards.

### Persistence

- On mount: `const saved = localStorage.getItem('uttt-game'); if (saved) return JSON.parse(saved);`
- On state change: `useEffect(() => localStorage.setItem('uttt-game', JSON.stringify(state)), [state]);`
- On "New Game": dispatch clears state, which triggers the effect to overwrite localStorage.
