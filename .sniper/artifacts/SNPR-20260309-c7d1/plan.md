# Architecture Plan — Ultimate Tic Tac Toe

**Sprint:** SNPR-20260309-c7d1
**Date:** 2026-03-09
**Author:** Architect Agent
**Source:** [`prd.md`](./prd.md), [`discovery-brief.md`](./discovery-brief.md)

---

## Context

We are building a local two-player Ultimate Tic Tac Toe game as a single-page web application. The game renders a 3×3 meta-board of 3×3 sub-boards (81 cells total), enforces the canonical move-constraint rules, and provides animated feedback for marks, sub-board wins, and game wins. The application is dark-themed, desktop-first (responsive to tablet), and runs only as a local dev server. There is no backend, no persistence, no AI, and no networking.

**Stack (decided):** React 19, TypeScript, Vite, Zustand, Motion, CSS Modules, Vitest.

**Key constraints:**
- Pure frontend — all state in-browser, no persistence across refreshes
- Game engine must be a pure-function layer independent of React for testability (NFR-2.1)
- Desktop-first; tablet-functional; phones usable but not optimized (FR-10)
- Dark mode only (FR-9.1)

---

## Decisions

### D1: Project Structure

**Context:** The codebase needs clear separation between game logic, state management, UI components, and styles.

**Options:**
1. Flat `src/` with all files at one level
2. Domain-grouped folders: `engine/`, `store/`, `components/`, with co-located styles

**Decision:** Option 2 — domain-grouped folders.

```
src/
  engine/          # Pure game logic (no React imports)
    types.ts       # TypeScript types/interfaces
    constants.ts   # Board dimensions, win lines
    engine.ts      # Pure functions: makeMove, checkWin, etc.
    engine.test.ts # Vitest unit tests
  store/
    gameStore.ts   # Zustand store wiring engine to React
  components/
    App.tsx / App.module.css
    GameStatus.tsx / GameStatus.module.css
    MetaBoard.tsx / MetaBoard.module.css
    SubBoard.tsx / SubBoard.module.css
    Cell.tsx / Cell.module.css
    Controls.tsx / Controls.module.css
    WinOverlay.tsx / WinOverlay.module.css
  global.css       # CSS custom properties, reset, dark theme tokens
  main.tsx         # React entrypoint
index.html
```

**Consequences:** Clear ownership boundaries. Engine is fully testable without React. Components are self-contained with co-located styles.

---

### D2: Game Engine as Pure Functions

**Context:** The PRD requires the engine to be unit-testable without rendering UI (NFR-2.1). The engine must handle move validation, win detection at two levels, draw detection, and the move-constraint mechanic.

**Options:**
1. Engine as a class with mutable state
2. Engine as pure functions operating on immutable state objects

**Decision:** Option 2 — pure functions. The primary function is `makeMove(state, boardIndex, cellIndex) => GameState | null`, returning `null` for invalid moves. Supporting functions: `checkSubBoardWin`, `checkMetaBoardWin`, `getValidMoves`, `isEarlyDraw`, `createInitialState`.

**Consequences:** Easy to test (input → output). No side effects. Zustand store calls engine functions and stores the result. Slightly more verbose than a class but far simpler to reason about.

---

### D3: State Management with Zustand

**Context:** Need to bridge pure engine functions to React. Zustand was decided in the discovery phase.

**Options:**
1. React `useReducer` with context
2. Zustand (external store)

**Decision:** Zustand. A single store exposes `state: GameState` and actions `playMove(boardIndex, cellIndex)` and `resetGame()`. The store calls engine pure functions internally.

**Consequences:** Minimal boilerplate. Components subscribe to slices of state. No prop drilling. Store is thin — delegates all logic to engine.

---

### D4: Styling with CSS Modules + Custom Properties

**Context:** Need scoped styles per component with a dark theme and player-color tokens.

**Options:**
1. Tailwind CSS
2. CSS Modules with CSS custom properties
3. Styled-components / Emotion

**Decision:** CSS Modules with CSS custom properties. Define theme tokens (colors, spacing) in `global.css` as `--var` custom properties. Each component imports its own `.module.css`.

**Consequences:** Zero runtime CSS overhead. Scoped by default. Theme tokens are centralized and easily adjustable. No additional dependency beyond what Vite provides.

**Theme tokens (defined in `global.css`):**
- `--color-bg`: dark background (~`#0f0f0f`)
- `--color-surface`: slightly lighter surface (~`#1a1a2e`)
- `--color-x`: player X color (~`#00d4ff`, cyan-ish)
- `--color-o`: player O color (~`#ff6b6b`, coral)
- `--color-text`: primary text (~`#e0e0e0`)
- `--color-text-muted`: secondary text (~`#888`)
- `--color-active-board`: highlight for active sub-board (~`rgba(255,255,255,0.08)`)
- `--color-border`: grid lines (~`#333`)
- `--color-border-thick`: sub-board separators (~`#555`)
- `--radius-cell`, `--transition-fast`, `--transition-normal`

---

### D5: Animation Strategy with Motion

**Context:** The PRD requires animations for mark placement (FR-9.3), sub-board win overlays (FR-9.4), and game-win celebration (FR-9.5). Motion (formerly Framer Motion) was chosen.

**Options:**
1. CSS animations only
2. Motion for all animations
3. Motion for complex animations, CSS for simple hover/active states

**Decision:** Option 3 — hybrid. Use CSS for hover states and simple transitions (board highlighting, opacity changes). Use Motion for:
- **Mark placement:** scale-in from 0 → 1 with slight overshoot (`type: "spring"`)
- **Sub-board win overlay:** fade-in + scale from 0.5 → 1 (`AnimatePresence` + `motion.div`)
- **Game-win celebration:** confetti-style particle burst or pulsing glow on the winning line. Keep it simple — a `motion.div` scale/opacity animation on the victory message, plus pulsing the three winning sub-boards.

**Consequences:** CSS handles the frequent, simple animations (no JS overhead for 81 hover states). Motion handles the infrequent, meaningful animations where spring physics and presence transitions add value.

---

### D6: Win Detection Algorithm

**Context:** Win detection is needed at two levels — sub-board (3×3) and meta-board (3×3 of sub-board outcomes). The same algorithm works at both levels.

**Decision:** Define the 8 winning lines as index triples: `[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]`. A `checkWinner(cells: CellValue[])` function checks if any line has three identical non-empty values. Reuse for both sub-board cells and meta-board outcomes.

**Early draw detection (FR-5.5):** After each move, check whether either player can still achieve three sub-boards in a row. For each of the 8 meta-board lines, if a line contains sub-boards won by both X and O, that line is dead. If all 8 lines are dead for both players, the game is a draw. This is a simple O(8) check per move.

---

### D7: Keyboard Navigation

**Context:** FR-11.2 requires keyboard navigation for all 81 cells.

**Decision:** Each `Cell` renders a `<button>` element. Cells within a sub-board are arranged in a CSS grid, and sub-boards are arranged in an outer CSS grid. Use `tabIndex` management: cells in the active sub-board(s) get `tabIndex={0}`, inactive cells get `tabIndex={-1}`. Arrow-key navigation within a sub-board is handled via an `onKeyDown` handler that moves focus based on arrow direction. This gives natural Tab order across active boards and arrow-key navigation within boards.

**Consequences:** Accessible by default (buttons have built-in keyboard/screen-reader support). Focus management keeps the tab order sensible despite 81 elements.

---

### D8: Component Responsibility Split

**Context:** Need to decide what each component owns.

**Decision:** Keep components thin — display and interaction only. All game logic lives in the engine; all state coordination lives in the store. Components read from the store and call store actions.

**Consequences:** Components are easy to test visually. Logic bugs are isolated to the engine (testable without React).

---

## Components

### `App`
- **Role:** Root layout. Renders `GameStatus`, `MetaBoard`, and `Controls` in a vertical stack.
- **Ownership:** `frontend`
- **State access:** None directly (children access store).

### `GameStatus`
- **Role:** Displays current player turn, game-over message (win/draw). Animated transitions between states.
- **Ownership:** `frontend`
- **State access:** Reads `currentPlayer`, `gameStatus`, `winner` from store.
- **Animation:** Motion `AnimatePresence` for message transitions.

### `MetaBoard`
- **Role:** Renders 3×3 grid of `SubBoard` components. Passes board index to each.
- **Ownership:** `frontend`
- **State access:** None directly (passes props to SubBoard).
- **Layout:** CSS Grid `grid-template-columns: repeat(3, 1fr)` with thick gap/border.

### `SubBoard`
- **Role:** Renders 3×3 grid of `Cell` components for a given board index. Shows win overlay when the sub-board is won. Applies active/inactive visual state.
- **Ownership:** `frontend`
- **Props:** `boardIndex: number`
- **State access:** Reads `boards[boardIndex]`, `subBoardOutcomes[boardIndex]`, `activeBoard` from store.
- **Animation:** Motion for win overlay entrance.

### `WinOverlay`
- **Role:** Large X or O symbol overlaid on a won sub-board. Separated from `SubBoard` for animation isolation.
- **Ownership:** `frontend`
- **Props:** `winner: Player`
- **Animation:** Motion `scale` + `opacity` spring animation on mount.

### `Cell`
- **Role:** Single playable cell. Renders as a `<button>`. Displays X, O, or empty. Handles click and keyboard events.
- **Ownership:** `frontend`
- **Props:** `boardIndex: number`, `cellIndex: number`
- **State access:** Reads cell value, computes whether cell is playable (valid move). Calls `playMove(boardIndex, cellIndex)` on click.
- **Animation:** Motion spring for mark appearance.
- **Accessibility:** `<button>` with `aria-label` describing position and state. `tabIndex` managed for keyboard navigation.

### `Controls`
- **Role:** Renders "New Game" button. Always visible and enabled (FR-8.2).
- **Ownership:** `frontend`
- **State access:** Calls `resetGame()` from store.

---

## Data Model

All types live in `src/engine/types.ts`.

```typescript
/** Cell value: empty, X, or O */
export type CellValue = null | 'X' | 'O';

/** Player identifier */
export type Player = 'X' | 'O';

/** Outcome of a sub-board or the meta-board */
export type BoardOutcome = null | 'X' | 'O' | 'draw';

/** Game status */
export type GameStatus = 'playing' | 'won' | 'draw';

/**
 * Complete game state — immutable between moves.
 * Passed to and returned from all engine functions.
 */
export interface GameState {
  /**
   * 9 sub-boards, each containing 9 cells.
   * boards[boardIndex][cellIndex] where both indices are 0-8.
   * Board layout (index mapping):
   *   0 | 1 | 2
   *   ---------
   *   3 | 4 | 5
   *   ---------
   *   6 | 7 | 8
   */
  boards: CellValue[][];

  /** Outcome of each sub-board (null = in progress) */
  subBoardOutcomes: BoardOutcome[];

  /** Current player */
  currentPlayer: Player;

  /**
   * Index (0-8) of the sub-board the current player must play in.
   * null = free move (player can choose any playable sub-board).
   */
  activeBoard: number | null;

  /** Overall game status */
  status: GameStatus;

  /** Winner of the overall game (null if not yet won) */
  winner: Player | null;

  /** Indices of the three winning sub-boards on the meta-board (for highlight) */
  winningLine: number[] | null;
}
```

### Engine Function Signatures

```typescript
/** Create a fresh game state */
function createInitialState(): GameState;

/**
 * Attempt to place the current player's mark.
 * Returns the new GameState if the move is valid, or null if invalid.
 */
function makeMove(state: GameState, boardIndex: number, cellIndex: number): GameState | null;

/**
 * Check if a set of 9 values contains a three-in-a-row winner.
 * Used for both sub-board cells and meta-board outcomes.
 * Returns the winning player or null.
 */
function checkWinner(cells: (CellValue | BoardOutcome)[]): Player | null;

/**
 * Determine which winning line (indices) achieved the win, if any.
 * Returns the three indices or null.
 */
function getWinningLine(cells: (CellValue | BoardOutcome)[]): number[] | null;

/**
 * Check if the meta-board is in an early-draw state:
 * neither player can achieve three in a row.
 */
function isEarlyDraw(subBoardOutcomes: BoardOutcome[]): boolean;

/**
 * Determine the next active board based on the cell that was just played.
 * Returns the board index, or null if it's a free move
 * (target board is already decided).
 */
function getNextActiveBoard(cellIndex: number, subBoardOutcomes: BoardOutcome[]): number | null;
```

### Zustand Store Interface

```typescript
interface GameStore {
  /** Current game state */
  game: GameState;

  /** Place a mark — delegates to engine.makeMove */
  playMove: (boardIndex: number, cellIndex: number) => void;

  /** Reset to initial state */
  resetGame: () => void;
}
```

### Constants (`src/engine/constants.ts`)

```typescript
export const BOARD_SIZE = 3;
export const TOTAL_CELLS = 9;
export const TOTAL_BOARDS = 9;

/** All possible three-in-a-row lines (indices into a 9-element array) */
export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];
```

---

## Story Map

Based on the architecture, implementation should proceed in this order. Each story is independently testable.

| # | Story | Scope | Depends On |
|---|-------|-------|------------|
| S01 | Project scaffolding | Vite + React + TS + Zustand + Motion + Vitest setup, folder structure, `global.css` with theme tokens | — |
| S02 | Game types & constants | `types.ts`, `constants.ts` | S01 |
| S03 | Game engine — core | `createInitialState`, `makeMove`, `checkWinner`, `getNextActiveBoard` | S02 |
| S04 | Game engine — draw & edge cases | `isEarlyDraw`, free-move logic, full sub-board detection | S03 |
| S05 | Engine unit tests | Full test suite covering NFR-2.2 scenarios | S03, S04 |
| S06 | Zustand store | `gameStore.ts` wiring engine to React | S03 |
| S07 | Board rendering | `MetaBoard`, `SubBoard`, `Cell` — static grid display | S01, S06 |
| S08 | Game interaction | Click handling, move placement, active board highlighting | S06, S07 |
| S09 | Sub-board win overlay | `WinOverlay` component with Motion animation | S08 |
| S10 | Game status & controls | `GameStatus`, `Controls`, new-game reset | S06 |
| S11 | Mark & celebration animations | Motion spring on Cell marks, game-win celebration | S09, S10 |
| S12 | Responsive layout & keyboard nav | Media queries, `tabIndex` management, arrow-key handler | S07 |
