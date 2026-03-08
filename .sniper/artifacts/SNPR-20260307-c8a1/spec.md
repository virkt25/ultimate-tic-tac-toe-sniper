# Discovery Spec: Ultimate Tic-Tac-Toe Web Game

**Protocol ID:** SNPR-20260307-c8a1
**Date:** 2026-03-07
**Status:** Draft

---

## 1. Game Rules Summary

Ultimate tic-tac-toe is played on a 3x3 grid of smaller 3x3 tic-tac-toe boards (9 boards, 81 cells total). Two players (X and O) take turns.

### Core Rules

1. **First move:** The first player (X) may play in any cell on any board.
2. **Subsequent moves:** The board you must play on is determined by the position of the previous player's move within their small board. For example, if your opponent plays in the top-right cell of any small board, you must play on the top-right small board.
3. **Winning a small board:** A small board is won when a player completes a row, column, or diagonal of 3 within it (standard tic-tac-toe rules).
4. **Winning the game:** The overall game is won when a player wins three small boards in a row, column, or diagonal on the meta (large) board.

### Edge Cases

5. **Sent to an already-won board:** If a player is sent to a board that has already been won (by either player), they may play in any cell on any non-completed board. (Source: Math with Bad Drawings recommended rule variant.)
6. **Sent to a full/drawn board:** Same as above -- the player may play anywhere on any open board.
7. **Drawn small boards:** A small board that is full with no winner counts for neither player. It is "dead" and cannot be claimed.
8. **Game draw:** If all 9 small boards are resolved (won or drawn) and neither player has 3 in a row on the meta board, the game is a draw.

### Sources for Rules

- [Math with Bad Drawings - Ultimate Tic-Tac-Toe](https://mathwithbaddrawings.com/ultimate-tic-tac-toe-original-post/)
- [The Game Gal - Ultimate Tic-Tac-Toe](https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/)

---

## 2. Core Requirements

### 2.1 Game Engine

- Pure TypeScript module with no UI dependencies
- Immutable game state representation (board state, current player, active board constraint, move history)
- Move validation: check cell is empty, board is correct (or free choice), board is not already won/drawn
- Win detection for small boards (rows, columns, diagonals)
- Win detection for meta board (same logic applied to board-level winners)
- Draw detection at both board and game level
- Determine which board(s) the next player must play on
- Game reset functionality

### 2.2 UI / Rendering

- 3x3 grid of sub-boards, each containing a 3x3 grid of cells (nested grid layout)
- Clear visual distinction between X and O marks
- Highlight the active board(s) where the current player must play
- Show won boards with the winning player's mark overlaid or replacing the cells
- Show drawn boards with a distinct "dead" visual treatment
- Current player indicator (whose turn it is)
- Game over state with winner announcement or draw declaration
- New Game / Reset button

### 2.3 Interactions

- Click a cell to place a mark
- Invalid moves should be prevented (unclickable cells/boards), not produce error messages
- Visual hover feedback on valid cells only
- Smooth transitions when boards are won

### 2.4 UX Polish

- Responsive layout that works on desktop and mobile screens
- Clean, modern aesthetic (no skeuomorphism, no clutter)
- Subtle animations for: placing marks, winning a board, winning the game
- Color-coded players (e.g., blue/red or similar high-contrast pair)
- Active board highlighting should be immediately obvious (glow, background tint, or border emphasis)

---

## 3. Technical Considerations

### 3.1 Framework Selection

**Recommendation: React + TypeScript + Vite**

| Option | Pros | Cons |
|--------|------|------|
| **React + Vite** | Massive ecosystem, well-known, excellent TS support, component model maps naturally to nested board structure | Larger bundle than Svelte, virtual DOM overhead (negligible for this app) |
| **Svelte + Vite** | Smallest bundle (~1.6KB), fastest runtime, less boilerplate | Smaller ecosystem, fewer developers familiar with it |
| **Vanilla TS + Vite** | Zero framework overhead, full control | Manual DOM management, more boilerplate, harder to maintain component structure |

React is recommended because:
- The nested board structure (MetaBoard > SubBoard > Cell) maps naturally to React's component model
- State management via `useReducer` or Zustand fits the game state pattern well
- The project config already lists TypeScript as the language
- Prior implementation in this repo used React (evidence from deleted file paths: `src/components/App.tsx`, `src/store/gameStore.ts`)
- Vite provides fast HMR and simple configuration

### 3.2 State Management

Two viable approaches:

1. **useReducer + Context** -- Built-in React, no dependencies. Game actions (PLACE_MARK, RESET) dispatched through a reducer. Sufficient for a two-player local game with no async operations.
2. **Zustand** -- Lightweight (~1KB), simpler API than Context for deeply nested component access. Prior implementation used this (`src/store/gameStore.ts`).

**Recommendation:** Zustand for simplicity of access from any component without prop drilling or Context boilerplate.

### 3.3 Styling

| Option | Pros | Cons |
|--------|------|------|
| **CSS Modules** | Zero runtime, scoped by default, works with Vite out of the box | No dynamic theming, verbose for complex conditional styles |
| **Tailwind CSS** | Utility-first, fast prototyping, consistent design tokens | Class clutter in JSX, build config needed |
| **Vanilla CSS** | Simplest, no tooling | Global scope issues, harder to maintain |

**Recommendation:** CSS Modules (prior implementation used them: `*.module.css` files). Simple, zero-runtime, scoped. Animations can use CSS keyframes or transitions.

### 3.4 Testing

- **Vitest** for unit tests (integrates natively with Vite)
- Game engine should be tested independently of React components
- Key test cases: move validation, win detection (all orientations), draw detection, board constraint logic, edge case of sent-to-won-board
- Optional: React Testing Library for component interaction tests

### 3.5 Build & Tooling

- **Vite** as build tool and dev server
- **ESLint** for linting (with TypeScript parser)
- **Prettier** for formatting
- **TypeScript** strict mode enabled

### 3.6 Data Model Sketch

```typescript
type Player = 'X' | 'O';
type CellState = Player | null;
type BoardResult = Player | 'draw' | null; // null = in progress

interface GameState {
  boards: CellState[][]; // 9 boards, each with 9 cells (flat arrays)
  boardResults: BoardResult[]; // result of each of the 9 sub-boards
  currentPlayer: Player;
  activeBoard: number | null; // which board must be played on (null = free choice)
  winner: Player | 'draw' | null;
  lastMove: { board: number; cell: number } | null;
}
```

---

## 4. Risks and Open Questions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Mobile touch targets too small (81 cells on small screens) | Medium | High | Responsive layout with minimum cell size; consider zoom-to-board interaction on very small screens |
| Rule variant confusion (sent-to-won-board) | Low | Medium | Implement the most common variant (free choice when sent to won/full board); document in-game |
| Accessibility for screen readers with 81 interactive cells | Medium | Medium | Proper ARIA labels, keyboard navigation with tab/arrow keys, announce game state changes |
| Visual clutter with 9 boards + highlights + marks | Medium | Medium | Strong visual hierarchy: muted inactive boards, bold active board, clean typography |

### Open Questions

1. **Animation library:** Should we use CSS-only animations, or bring in Framer Motion for more complex transitions (e.g., board-won celebration)? CSS-only is lighter but more limited.
2. **Move history / undo:** Should the game support undo or move history navigation? This adds complexity to state management. (Recommendation: out of scope for v1.)
3. **Sound effects:** Any audio feedback for moves or wins? (Recommendation: out of scope for v1.)
4. **Board size on mobile:** At what breakpoint does the 81-cell grid become too small? May need user testing. A minimum cell size of ~32px suggests the grid needs at least ~320px width.
5. **Draw handling at meta level:** If all boards are claimed/drawn but no player has 3-in-a-row, is it a draw? (Assumption: yes, this is a draw.)

---

## 5. Out of Scope

The following are explicitly **not** part of this project:

- **No backend / server** -- Entirely client-side, single HTML page
- **No AI opponent** -- Two human players only, same browser
- **No online multiplayer** -- No WebSocket, no networking, no lobby
- **No user accounts or persistence** -- No login, no saved games (localStorage stretch goal at most)
- **No move history / replay** -- Not in v1
- **No customizable themes** -- Single clean default theme
- **No sound effects** -- Silent game

---

## 6. Competitive Analysis

Existing implementations reviewed for inspiration:

| Implementation | Stack | Notable UX Choices |
|---------------|-------|-------------------|
| [michaelxing.com/UltimateTTT](https://michaelxing.com/UltimateTTT/v3/) | Vanilla JS | Clean grid, color-coded active board |
| [ziap/uttt](https://github.com/ziap/uttt) | Vanilla JS/TS | High-performance engine, minimal UI |
| [amja/tictactoe](https://github.com/amja/tictactoe) | JS + MCTS AI | AI opponent, clean board rendering |
| [joeyrobert.org](https://joeyrobert.org/projects/ultimatetictactoe/) | Vanilla JS | Simple, functional, good reference |

**Key UX patterns observed across implementations:**
- Active board is highlighted with a colored background or border
- Won boards display a large X or O overlay
- Inactive/unavailable boards are visually muted
- Grid lines provide clear separation between sub-boards vs. cells within sub-boards (thicker outer lines)

---

## 7. Recommended Approach Summary

| Concern | Recommendation |
|---------|---------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| State management | Zustand |
| Styling | CSS Modules |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Deployment | Static files (Vite build), deployable to any CDN |

The game engine should be a pure TypeScript module (`src/engine/`) with no React dependencies, fully unit-tested. The UI layer (`src/components/`) consumes engine logic through a Zustand store (`src/store/`). This separation enables testing the game logic independently and keeps the component tree focused on rendering and interaction.
