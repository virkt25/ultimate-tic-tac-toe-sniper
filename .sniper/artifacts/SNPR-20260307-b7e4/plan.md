# Architecture Plan: Ultimate Tic-Tac-Toe

**Protocol:** SNPR-20260307-b7e4
**Phase:** Plan
**Date:** 2026-03-07

---

## Context

Build a client-side Ultimate Tic-Tac-Toe web app for two local players. The game features a 3x3 meta-board of 3x3 sub-boards (81 cells) with a "send rule" that constrains where the opponent must play next. No backend, no auth, no AI opponent. Target: polished UX, accessible, under 200KB gzipped, statically deployable.

Key decisions: framework, state management, styling, testing, project structure, and state persistence.

---

## Decisions

### D1: Frontend Framework — React with Vite

**Context:** Five options evaluated (React, Svelte, Vue, Preact, Vanilla TS). Project is a simple game with ~15 source files, no data fetching, no routing.

**Options considered:** All five from the spec. Preact and Svelte offer smaller bundles. Vanilla TS avoids framework overhead entirely. Vue is a middle ground.

**Decision:** React with Vite. The ~45KB gzipped cost is well within the 200KB budget. React has the largest ecosystem, best TypeScript ergonomics, most mature testing story (React Testing Library), and widest contributor familiarity. For a project this small, bundle size differences are irrelevant in practice.

**Consequences:** Slightly larger bundle than Preact/Svelte. Virtual DOM overhead is negligible for 81 cells. Gains: zero surprises, excellent tooling, easy onboarding.

### D2: State Management — Zustand

**Context:** Game state is a single object tree (~81 cells, 9 sub-board statuses, current player, active constraint, game outcome). Needs clear actions for moves, resets, and derived state for valid moves.

**Options considered:** (a) useReducer + context, (b) Zustand, (c) Jotai, (d) Redux Toolkit.

**Decision:** Zustand. Minimal boilerplate, works outside React components (game engine can dispatch without hooks), built-in middleware for localStorage persistence, and tiny (~1KB). useReducer would also work but Zustand's ability to be called from pure TS functions (the engine) and its persist middleware tip the balance.

**Consequences:** One small dependency. Store is accessible from both React components and pure TS test code.

### D3: Styling — CSS Modules

**Context:** The UI is a nested grid with overlays, highlights, and hover states. No design system, no complex theming.

**Decision:** CSS Modules. Zero runtime cost, scoped class names, native Vite support, no extra dependencies. Custom properties (CSS variables) for theming (colors, spacing) in a single global file.

**Consequences:** More verbose than Tailwind for utility styles, but keeps the styling simple and dependency-free. Good fit for a game where components have distinct, non-reusable styles.

### D4: Test Runner — Vitest

**Context:** Need unit tests for game engine and component tests for UI.

**Decision:** Vitest. Native Vite integration, Jest-compatible API, first-class TypeScript/ESM support, fastest setup. Pair with React Testing Library for component tests and jsdom for DOM environment.

**Consequences:** Standard tooling, no configuration friction.

### D5: Project Structure — Pattern A (Feature-Based), Lightly Nested

**Context:** ~15-20 source files. Need clear separation between pure game engine and React UI.

**Decision:** Pattern A from the codebase overview with minimal nesting. Three top-level source directories: `engine/` (pure TS, zero React), `components/` (React UI), and `store/` (Zustand). Styles co-located as CSS Modules next to components.

**Consequences:** Clean boundary between testable pure logic and UI. Engine directory has no framework imports and can be tested in isolation.

### D6: State Persistence — localStorage via Zustand Persist

**Context:** Spec lists persistence as optional. Low effort with Zustand's persist middleware.

**Decision:** Yes, persist to localStorage. Zustand's `persist` middleware handles serialization automatically. No version migration needed for v1 since we control the initial schema.

**Consequences:** Games survive page reloads. Adds ~10 lines of config. New Game button clears persisted state.

---

## Components

```
App
├── GameStatus          -- Displays current player turn or game result
├── MetaBoard           -- 3x3 grid of SubBoards
│   └── SubBoard (x9)  -- Single 3x3 sub-board with ownership overlay
│       └── Cell (x9)  -- Single playable cell (click handler, hover state)
└── Controls            -- New Game button
```

**Responsibilities:**

- **App:** Mounts store provider, layout shell, orchestrates top-level structure.
- **GameStatus:** Reads `currentPlayer` and `gameOutcome` from store. Announces to screen readers via aria-live region.
- **MetaBoard:** Renders 3x3 grid of SubBoard. Passes board index to each.
- **SubBoard:** Reads sub-board status and active constraint from store. Renders ownership overlay (X/O/draw) when resolved. Applies active/inactive visual states. Contains 9 Cell children.
- **Cell:** Reads cell value, whether it is a valid move, and whether it is the last move. Handles click (dispatches `makeMove` action). Keyboard accessible (button role).
- **Controls:** New Game button dispatches `resetGame` action.

**Data flow:** Components read from Zustand store via hooks (`useGameStore`). User clicks dispatch store actions. Store actions call pure engine functions to compute next state.

---

## Data Model

```typescript
type Player = 'X' | 'O';
type CellValue = Player | null;
type SubBoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type SubBoardStatus =
  | { result: 'playing' }
  | { result: 'won'; winner: Player }
  | { result: 'draw' };

interface GameState {
  board: CellValue[][];        // board[subBoardIndex][cellIndex], 9 arrays of 9
  subBoardStatus: SubBoardStatus[];  // 9 statuses
  currentPlayer: Player;
  activeSubBoard: SubBoardIndex | null;  // null = free move
  lastMove: { subBoard: SubBoardIndex; cell: CellIndex } | null;
  gameOutcome: { result: 'win'; winner: Player } | { result: 'draw' } | null;
  moveCount: number;
}
```

**Send rule in state:** `activeSubBoard` holds the sub-board index the current player must play in. When a player places a mark at `cellIndex` in any sub-board, `activeSubBoard` is set to `cellIndex` — unless that sub-board is resolved, in which case it becomes `null` (free move). `null` means any active sub-board is valid.

**State transitions:** All transitions go through a single `makeMove(subBoard, cell)` action that validates the move via the engine, updates the board, checks sub-board win/draw, checks meta-board win/draw, advances the turn, and computes the next `activeSubBoard`.

---

## API Contracts

No backend exists. The game engine exposes these pure functions:

```typescript
// Core engine API (all pure functions, no side effects)
function makeMove(state: GameState, subBoard: SubBoardIndex, cell: CellIndex): GameState;
function isValidMove(state: GameState, subBoard: SubBoardIndex, cell: CellIndex): boolean;
function getValidMoves(state: GameState): Array<{ subBoard: SubBoardIndex; cell: CellIndex }>;
function checkSubBoardWin(cells: CellValue[]): Player | null;
function checkMetaBoardWin(statuses: SubBoardStatus[]): Player | null;
function createInitialState(): GameState;
```

The Zustand store wraps these functions in actions that update the store and trigger re-renders.

---

## File Structure

```
ultimate-tic-tac-toe-sniper/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
├── src/
│   ├── main.tsx                          -- Entry point, renders App
│   ├── global.css                        -- CSS variables, resets, base styles
│   ├── engine/
│   │   ├── types.ts                      -- All game types (GameState, Player, etc.)
│   │   ├── engine.ts                     -- Pure game logic functions
│   │   ├── engine.test.ts                -- Unit tests for all engine logic
│   │   └── constants.ts                  -- WIN_PATTERNS, BOARD_SIZE
│   ├── store/
│   │   ├── gameStore.ts                  -- Zustand store with persist middleware
│   │   └── gameStore.test.ts             -- Store integration tests
│   └── components/
│       ├── App.tsx                        -- Root layout
│       ├── App.module.css
│       ├── MetaBoard.tsx                  -- 3x3 grid of SubBoards
│       ├── MetaBoard.module.css
│       ├── SubBoard.tsx                   -- Single sub-board with overlay
│       ├── SubBoard.module.css
│       ├── Cell.tsx                       -- Single cell (button)
│       ├── Cell.module.css
│       ├── GameStatus.tsx                 -- Turn/result display
│       ├── GameStatus.module.css
│       ├── Controls.tsx                   -- New Game button
│       └── Controls.module.css
```

**Total: ~20 source files.** Engine directory has zero React imports. Components import only from `engine/types.ts` and `store/gameStore.ts`.
