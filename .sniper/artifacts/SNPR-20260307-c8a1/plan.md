# Architecture Plan: Ultimate Tic-Tac-Toe

**Protocol ID:** SNPR-20260307-c8a1
**Date:** 2026-03-07

---

## 1. Project Structure

```
/
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
├── eslint.config.js
├── .prettierrc
├── src/
│   ├── main.tsx                  # React entry point
│   ├── global.css                # CSS reset, custom properties, fonts
│   ├── vite-env.d.ts
│   ├── engine/
│   │   ├── types.ts              # All game types
│   │   ├── constants.ts          # WINNING_LINES, initial state factory
│   │   ├── engine.ts             # Pure game logic functions
│   │   └── engine.test.ts        # Engine unit tests
│   ├── store/
│   │   ├── gameStore.ts          # Zustand store
│   │   └── gameStore.test.ts     # Store integration tests
│   └── components/
│       ├── App.tsx / App.module.css
│       ├── MetaBoard.tsx / MetaBoard.module.css
│       ├── SubBoard.tsx / SubBoard.module.css
│       ├── Cell.tsx / Cell.module.css
│       ├── GameStatus.tsx / GameStatus.module.css
│       └── Controls.tsx / Controls.module.css
```

Ownership: `src/engine/` and `src/store/` are shared logic. `src/components/` maps to the frontend ownership boundary.

---

## 2. Data Model

```typescript
// src/engine/types.ts

type Player = 'X' | 'O';
type CellState = Player | null;
type BoardResult = Player | 'draw' | null; // null = in progress

interface Move {
  boardIndex: number; // 0-8, which sub-board
  cellIndex: number;  // 0-8, which cell within that sub-board
}

interface GameState {
  boards: CellState[][];       // boards[0..8][0..8]
  boardResults: BoardResult[]; // boardResults[0..8]
  currentPlayer: Player;
  activeBoard: number | null;  // null = free choice
  winner: BoardResult;         // null = in progress, Player = won, 'draw'
  lastMove: Move | null;
  moveHistory: Move[];         // ordered list for undo support
}
```

**Index mapping:** Both boards and cells use a flat 0-8 index where `index = row * 3 + col`. This keeps the model simple. The UI converts to row/col for grid rendering.

---

## 3. Game Engine API

All functions are pure (no side effects, no mutations). Each returns a new `GameState`.

```typescript
// src/engine/engine.ts

function createInitialState(): GameState;

function makeMove(state: GameState, move: Move): GameState;
// Precondition: move must be valid (caller should check first).
// 1. Places mark at boards[move.boardIndex][move.cellIndex]
// 2. Checks if sub-board is now won or drawn → updates boardResults
// 3. Checks if meta-board is now won or drawn → updates winner
// 4. Computes activeBoard for next turn:
//    - If target board (move.cellIndex) is resolved → null (free choice)
//    - Otherwise → move.cellIndex
// 5. Toggles currentPlayer
// 6. Pushes move to moveHistory

function isValidMove(state: GameState, move: Move): boolean;
// - state.winner must be null (game not over)
// - boardResults[move.boardIndex] must be null (board not resolved)
// - boards[move.boardIndex][move.cellIndex] must be null (cell empty)
// - activeBoard is null OR activeBoard === move.boardIndex

function checkBoardWin(board: CellState[]): Player | null;
// Checks all 8 winning lines (3 rows, 3 cols, 2 diagonals)

function checkBoardDraw(board: CellState[], result: BoardResult): boolean;
// Board is full AND result is still null

function getValidBoards(state: GameState): number[];
// Returns indices of boards that can accept moves.
// If activeBoard is set and that board is open → [activeBoard]
// Otherwise → all board indices where boardResults[i] === null

function undoMove(state: GameState): GameState;
// Pops last move from moveHistory, replays all moves from scratch
// on a fresh state. Simple and correct; performance is irrelevant
// for <= 81 moves.
```

**Decision: Replay-based undo** rather than storing snapshots. With max 81 moves, replaying is instant and avoids storing redundant state. Alternatives considered: memento pattern (more memory), reverse operations (error-prone with win/draw recalculation).

---

## 4. State Management — Zustand Store

```typescript
// src/store/gameStore.ts

interface GameStore {
  game: GameState;

  // Actions
  placeMark: (boardIndex: number, cellIndex: number) => void;
  undo: () => void;
  reset: () => void;

  // Derived (computed in selectors, not stored)
  // validBoards: number[] — use getValidBoards(store.game)
}
```

The store is a thin wrapper. Actions call engine functions and replace `game`. Components select only what they need via Zustand selectors to minimize re-renders:

- `MetaBoard` selects `game.boardResults`, `game.activeBoard`, `game.winner`
- `SubBoard` selects `game.boards[i]`, `game.boardResults[i]`
- `Cell` receives props from `SubBoard` (no direct store access)
- `GameStatus` selects `game.currentPlayer`, `game.winner`
- `Controls` selects `game.moveHistory.length` (for undo disabled state)

---

## 5. Component Tree

```
App
├── GameStatus          — Shows "Player X's turn" / "Player O wins!" / "Draw!"
├── MetaBoard           — 3x3 CSS Grid of SubBoards
│   └── SubBoard (x9)  — 3x3 CSS Grid of Cells; overlay when won/drawn
│       └── Cell (x9)  — Button element; shows X, O, or empty
└── Controls            — "New Game" and "Undo" buttons
```

**Component responsibilities:**

| Component | Props / Store Access | Key Behavior |
|-----------|---------------------|--------------|
| `App` | None | Layout shell, mounts children |
| `GameStatus` | `currentPlayer`, `winner` | Announces game state; uses `aria-live="polite"` |
| `MetaBoard` | `boardResults`, `activeBoard`, `winner` | Renders 3x3 grid; passes `isActive` and `isPlayable` to each SubBoard |
| `SubBoard` | `boardIndex`, `board`, `result`, `isActive` | Renders 3x3 grid of Cells; shows win overlay (large X/O) when result is set; shows draw overlay when drawn |
| `Cell` | `boardIndex`, `cellIndex`, `value`, `isPlayable`, `onClick` | `<button>` element; disabled when not playable; hover effect when playable |
| `Controls` | `reset()`, `undo()`, `canUndo` | Two buttons |

---

## 6. Styling Approach

**CSS Modules** with CSS custom properties defined in `global.css`:

```css
/* global.css — key design tokens */
:root {
  --color-x: #3b82f6;       /* blue-500 */
  --color-o: #ef4444;       /* red-500 */
  --color-active: #fef3c7;  /* amber-100, active board bg */
  --color-bg: #f8fafc;      /* slate-50 */
  --color-border: #cbd5e1;  /* slate-300 */
  --cell-size: clamp(28px, 8vw, 48px);
  --board-gap: clamp(2px, 0.5vw, 6px);
  --meta-gap: clamp(6px, 1.5vw, 16px);
}
```

**Responsive strategy:**
- Single-column centered layout at all sizes.
- `clamp()` for cell sizes — scales fluidly from 320px to 1440px.
- No breakpoint media queries needed; the grid scales continuously.
- Minimum touch target: 28px (acceptable; cells have spacing too).

**Animations (CSS only):**
- Cell mark placement: `scale(0) → scale(1)` with ease-out (150ms).
- Board win overlay: `opacity(0) → opacity(1)` fade-in (300ms).
- Active board highlight: background-color transition (200ms).

**Decision: CSS-only animations** over Framer Motion. The animations are simple transforms and opacity — no spring physics or layout animations needed. This avoids a runtime dependency. Alternative considered: Framer Motion (better for complex choreography, unnecessary here).

---

## 7. Key Architectural Decisions

### ADR-1: Pure engine with no UI coupling
- **Context:** Game logic must be testable independently.
- **Decision:** `src/engine/` exports pure functions that take and return `GameState`. No React, no store references.
- **Consequence:** Engine is fully unit-testable with Vitest. UI is a thin rendering layer.

### ADR-2: Flat array indexing (0-8) over 2D [row][col]
- **Context:** Need to represent 9 sub-boards and 9 cells within each.
- **Decision:** Use `index = row * 3 + col` everywhere. Convert to grid positions in CSS (`grid-row`, `grid-column`).
- **Consequence:** Simpler data model, straightforward move-to-board mapping (`move.cellIndex` directly gives the target `boardIndex`).

### ADR-3: Zustand over useReducer+Context
- **Context:** Deep component nesting (App > MetaBoard > SubBoard > Cell) needs state access.
- **Decision:** Zustand with selectors.
- **Consequence:** No Context boilerplate, fine-grained re-render control. Trade-off: one external dependency (~1KB).

### ADR-4: Replay-based undo
- **Context:** PRD requires undo functionality.
- **Decision:** Store `moveHistory: Move[]`. Undo replays all moves except the last on a fresh state.
- **Consequence:** Dead simple, zero edge cases. Max 81 replays is instant.

### ADR-5: CSS Modules + custom properties over Tailwind
- **Context:** Need scoped styles with design tokens.
- **Decision:** CSS Modules for scoping, CSS custom properties for theming.
- **Consequence:** Zero runtime cost, Vite-native support, matches prior implementation pattern.
