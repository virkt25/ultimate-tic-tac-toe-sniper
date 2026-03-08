# Discovery Spec: Ultimate Tic-Tac-Toe Web Game

**Date:** 2026-03-07
**Status:** Reconciled
**Author:** Analyst Agent

---

## 1. Requirements

### 1.1 Gameplay Rules

Ultimate Tic-Tac-Toe is a 9x9 board composed of nine standard 3x3 tic-tac-toe boards arranged in a 3x3 grid. The following rules apply ([Wikipedia](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe), [Math with Bad Drawings](https://mathwithbaddrawings.com/ultimate-tic-tac-toe-original-post/)):

- **Turn order:** X always goes first. Players alternate turns.
- **First move:** The first player may play in any cell on any small board.
- **Subsequent moves:** The cell a player picks within a small board determines which small board the next player must play in. For example, if X plays in the top-right cell of any small board, O must next play in the top-right small board.
- **Winning a small board:** A small board is won when a player gets three in a row (horizontally, vertically, or diagonally) within that board, following standard tic-tac-toe rules.
- **Winning the game:** The game is won when a player wins three small boards in a row on the larger 3x3 meta-grid.
- **Draw:** The game is a draw when all small boards are either won or fully filled and no player has won the meta-grid.

### 1.2 Edge Cases

These are critical to implement correctly:

| Edge Case | Rule |
|-----------|------|
| **Sent to a won/full board** | If a player is directed to a small board that is already won or completely filled, that player may choose any open small board to play in ("free move"). ([The Game Gal](https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/)) |
| **Tied small board** | A small board that is completely filled with no winner counts for neither player. It is "dead" — no further moves can be made in it, and it does not count as a win for either side. ([tictactoefree.com](https://tictactoefree.com/ultimate-tic-tac-toe/rules)) |
| **No valid moves remaining** | If all 81 cells are filled or all 9 small boards are decided (won or tied) and no player has three in a row on the meta-grid, the game is a draw. |

### 1.3 User Experience Requirements

Based on UX research ([NN/g](https://www.nngroup.com/articles/usability-heuristics-board-games/), [Genieee](https://genieee.com/best-practices-for-game-ui-ux-design/), [Smashing Magazine](https://www.smashingmagazine.com/2012/07/playful-ux-design-building-better-game/)):

- **Immediate playability:** Players should be able to start a game within one click from the landing state. No mandatory tutorials or sign-up flows.
- **Active board highlighting:** The small board where the current player must play should be visually distinct (highlighted border, background tint, etc.). When a player has a free move, all valid boards should be highlighted.
- **Turn indicator:** Clearly display whose turn it is (X or O) at all times.
- **Move feedback:** Clicking a valid cell should provide immediate visual feedback (animation, color change). Invalid clicks (wrong board, occupied cell) should be clearly rejected (subtle shake, visual cue — not intrusive alerts).
- **Won board visualization:** When a small board is won, overlay or replace it with a large X or O symbol so the meta-game state is glanceable.
- **Game outcome:** Display a clear winner announcement or draw declaration with an option to start a new game.
- **Undo/restart:** Provide a "New Game" button. Undo is a nice-to-have but not required for MVP.
- **Responsive layout:** The board must be usable on desktop and tablet. Mobile phone support is desirable but challenging given the 9x9 grid density.
- **Accessible colors:** Use color schemes that are distinguishable for colorblind users (don't rely solely on red/blue — use shapes, patterns, or labels as well).

### 1.4 Technical Requirements

Per `.sniper/config.yaml`:

- **Language:** TypeScript
- **Package manager:** npm
- **Deployment:** Purely client-side, no backend
- **Two-player mode:** Hot-seat / pass-and-play on the same browser
- **State management:** All game state lives in-browser. Game state is persisted to localStorage via Zustand's `persist` middleware to survive page refreshes.

---

## 2. Out of Scope

The following are explicitly **not** in scope for the initial build:

- **AI opponent / single-player mode** — No computer player
- **Online multiplayer** — No networking, WebSocket, or server communication
- **User accounts / authentication** — No login, profiles, or saved stats
- **Game history / persistence** — No saving/loading games across sessions (note: current-game persistence to localStorage IS implemented)
- **Undo/redo** — Nice-to-have but not required for MVP
- **Sound effects / music** — Visual-only for MVP
- **Mobile-first optimization** — Desktop and tablet are primary targets; mobile is best-effort
- **Accessibility (WCAG AA)** — Basic color considerations yes, but full screen reader / keyboard-only support is a stretch goal
- **Internationalization** — English only

---

## 3. Technical Options for the Architect

### 3.1 Frontend Framework

| Option | Pros | Cons | Notes |
|--------|------|------|-------|
| **React** (w/ Vite) | Largest ecosystem, most community examples of tic-tac-toe variants, strong TypeScript support, abundant hiring pool | Heavier bundle for a simple app, virtual DOM overhead unnecessary for this use case | React 19 is stable. Vite is the standard build tool. ([FrontendTools](https://www.frontendtools.tech/blog/best-frontend-frameworks-2025-comparison)) |
| **Svelte** (w/ SvelteKit or Vite) | Smallest bundle (60-70% smaller than React/Vue), no virtual DOM, compile-time optimizations, very clean syntax for reactive state | Smaller ecosystem, fewer community examples, less familiar to most developers | Svelte 5 with runes is stable. Excellent for small self-contained apps. ([merge.rocks](https://merge.rocks/blog/comparing-front-end-frameworks-for-startups-in-2025-svelte-vs-react-vs-vue)) |
| **Vue** (w/ Vite) | Smooth developer experience, simpler than React, good TypeScript support, single-file components are clean | Mid-sized bundle, smaller ecosystem than React | Vue 3 with Composition API. ([Strapi](https://strapi.io/blog/best-javascript-frameworks)) |
| **Vanilla TypeScript** (w/ Vite) | Zero framework overhead, smallest possible bundle, no abstractions to learn | Manual DOM manipulation, harder to maintain reactive UI state, more boilerplate for interactive elements | Viable for this scope but may slow development of polish features |

**Fact:** All four options work well with Vite as the build tool and TypeScript.
**Assumption:** The project is small enough that framework choice is primarily about developer preference and velocity, not performance.

### 3.2 Build Tool

| Option | Notes |
|--------|-------|
| **Vite** | De facto standard for all frameworks listed above. Fast HMR, built-in TypeScript support, minimal config. **Recommended regardless of framework choice.** |
| **esbuild (raw)** | Faster builds but less DX polish. Only makes sense for vanilla TS approach. |

### 3.3 Styling Approach

| Option | Pros | Cons |
|--------|------|------|
| **CSS Modules** | Scoped styles, zero runtime, works with all frameworks | Slightly more verbose class management |
| **Tailwind CSS** | Rapid prototyping, consistent design tokens, utility-first | Adds a dependency, HTML can get verbose, learning curve |
| **Plain CSS / CSS custom properties** | Zero dependencies, full control | No scoping without conventions, harder to maintain at scale |
| **CSS-in-JS (styled-components, etc.)** | Co-located styles, dynamic theming | Runtime cost, only relevant for React |

### 3.4 State Management

| Option | Notes |
|--------|-------|
| **Framework built-in** (React useState/useReducer, Svelte stores, Vue reactive) | Sufficient for this app's complexity. No external library needed. |
| **Zustand / Jotai** (React only) | Overkill for this scope but clean API if state grows |
| **No framework (plain TS objects + DOM updates)** | Works for vanilla approach |

**Assumption:** The game state is simple enough (81 cells + 9 board states + meta state + current player + active board) that framework-native state management is sufficient. No external state library should be needed.

### 3.5 Testing

| Option | Notes |
|--------|-------|
| **Vitest** | Fast, Vite-native, excellent TypeScript support. Works with all frameworks. |
| **Jest** | Industry standard but slower, more config needed with Vite |
| **Playwright / Cypress** | For E2E testing of the actual game flow. Playwright is lighter. |

---

## 4. Decisions

The following open questions have been resolved:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | React + Vite | Largest ecosystem, best TypeScript tooling, most community examples |
| **Styling** | CSS Modules + CSS custom properties | Scoped styles, zero runtime, design tokens via CSS custom properties in `global.css`. Tailwind is installed but unused. |
| **State management** | Zustand with `persist` middleware | Provides built-in localStorage sync, eliminates prop drilling. Replaces the originally planned `useReducer` approach. |
| **Testing** | Vitest | Vite-native, fast, excellent TypeScript support |
| **Draw detection** | Simple (all boards decided, no winner) | Early mathematical detection is too complex for MVP |
| **First move rule** | Standard (play anywhere) | Most common variant, what players expect |
| **localStorage persistence** | Yes, include in MVP | Low effort, high UX value — prevents losing game on tab close |
| **Tied board visual** | Greyed out with reduced opacity | Simple and universally understood |

---

## 5. Risks and Open Questions

### 4.1 Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Mobile usability** | Medium | A 9x9 grid with nested boards is inherently difficult on small screens. Pinch-to-zoom or a "zoom into active board" interaction pattern may be needed. This could add significant complexity. |
| **Edge case bugs** | Medium | The "sent to won/full board" free-move rule and the interaction between tied boards and game-over detection are the most common sources of bugs in UTTT implementations. Thorough unit testing of game logic is critical. |
| **Scope creep via polish** | Low | Animations, transitions, and visual polish can consume disproportionate time. Define a clear MVP visual standard before starting. |
| **Accessibility vs. information density** | Low | The board has 81 clickable cells. Making this keyboard-navigable and screen-reader friendly is a significant effort that may conflict with the "delightful" UX goal. |

### 5.2 Resolved Questions

All open questions from discovery have been resolved. See Section 4 (Decisions) for details.

---

## Sources

- [Ultimate tic-tac-toe - Wikipedia](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe)
- [Ultimate Tic-Tac-Toe - Math with Bad Drawings](https://mathwithbaddrawings.com/ultimate-tic-tac-toe-original-post/)
- [Ultimate Tic-Tac-Toe - The Game Gal](https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/)
- [Ultimate Tic-Tac-Toe Rules - tictactoefree.com](https://tictactoefree.com/ultimate-tic-tac-toe/rules)
- [Usability Heuristics Applied to Board Games - NN/g](https://www.nngroup.com/articles/usability-heuristics-board-games/)
- [Best Practices for Game UI/UX Design - Genieee](https://genieee.com/best-practices-for-game-ui-ux-design/)
- [Playful UX Design: Building A Better Game - Smashing Magazine](https://www.smashingmagazine.com/2012/07/playful-ux-design-building-better-game/)
- [React vs Vue vs Svelte Benchmarks - FrontendTools](https://www.frontendtools.tech/blog/best-frontend-frameworks-2025-comparison)
- [Svelte vs React vs Vue in 2025 - merge.rocks](https://merge.rocks/blog/comparing-front-end-frameworks-for-startups-in-2025-svelte-vs-react-vs-vue)
- [6 Best JavaScript Frameworks for 2026 - Strapi](https://strapi.io/blog/best-javascript-frameworks)

---

Last reconciled: 2026-03-07
