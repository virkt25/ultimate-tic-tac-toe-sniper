# Discovery Brief — Ultimate Tic Tac Toe (Web)

**Sprint:** SNPR-20260309-c7d1
**Date:** 2026-03-09
**Author:** Analyst Agent

---

## Findings

### Game Rules (Canonical)

Ultimate Tic Tac Toe (also called Super Tic Tac Toe or Meta Tic Tac Toe) is played on a 3x3 grid of 3x3 tic-tac-toe boards — 81 cells total. The rules are:

1. **First move:** X plays in any of the 81 cells.
2. **Subsequent moves:** The position of the previous move within its sub-board determines which sub-board the next player must play in. For example, if X plays in the top-right cell of any sub-board, O must play in the top-right sub-board.
3. **Winning a sub-board:** Standard tic-tac-toe rules — three in a row (horizontal, vertical, or diagonal) wins that sub-board for the player.
4. **Winning the game:** Win three sub-boards in a row on the meta-board (horizontal, vertical, or diagonal).
5. **Sent to a won/completed sub-board:** If a player is sent to a sub-board that has already been won or is full (drawn), that player may play in **any** open cell on **any** playable sub-board (free move).
6. **Drawn sub-boards:** A sub-board that fills up without either player winning counts for **neither** X nor O on the meta-board.
7. **Game draw:** If no player can win three sub-boards in a row and no playable moves remain, the game is a draw.

Sources: [Math with Bad Drawings](https://mathwithbaddrawings.com/ultimate-tic-tac-toe-original-post/), [The Game Gal](https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/), [tictactoefree.com](https://tictactoefree.com/ultimate-tic-tac-toe/rules)

**Variant rule (not recommended for v1):** A drawn sub-board counts for *both* players. This is a "house rule" variant mentioned in several sources but is not standard.

### UX Patterns Observed in Existing Implementations

From reviewing existing web implementations (GitHub topics: [ultimate-tic-tac-toe](https://github.com/topics/ultimate-tic-tac-toe), [Minimuino/ultimate-tic-tac-toe-react](https://github.com/Minimuino/ultimate-tic-tac-toe-react)):

- **Active board highlighting:** The playable sub-board(s) must be visually distinct from inactive ones. This is the single most critical UX element — without it, players cannot tell where they are allowed to move.
- **Won board overlay:** When a sub-board is won, the winning player's symbol (X or O) is displayed large over the entire sub-board, replacing or overlaying the individual cells.
- **Current player indicator:** Clear indication of whose turn it is (X or O), often with color coding.
- **Move history / undo:** Some implementations provide undo functionality; this is a nice-to-have.
- **Nested grid layout:** CSS Grid with nested grids (a 3x3 grid of 3x3 grids) is the standard layout approach. `grid-template-columns: repeat(3, 1fr)` at both levels.
- **Color theming:** Two distinct colors for X and O (e.g., blue/red, teal/coral) used consistently across cells, sub-board overlays, and status indicators.
- **Animations:** Smooth transitions for placing marks, winning a sub-board (scale/fade overlay), and game-over states improve the "delightful" feel.

### Frontend Framework Options

Research was conducted across multiple 2025-2026 comparison articles. The three leading candidates for a small, frontend-only game:

| Criterion | React 19 | Svelte 5 | Vue 4 |
|---|---|---|---|
| **Bundle size** | ~40-45KB (runtime) | ~5-15KB (compiled, no runtime) | ~30-35KB (runtime) |
| **Performance** | Good (virtual DOM) | Excellent (compiled, no VDOM) | Good (reactive proxy) |
| **Ecosystem** | Largest — any library exists | Growing — SvelteKit mature | Large — well-maintained |
| **Learning curve** | Moderate (hooks, JSX) | Low (HTML-like, runes) | Low (SFCs, Composition API) |
| **Animation support** | Motion (formerly Framer Motion) — 16M+ downloads/mo | svelte/transition built-in | Vue Transition built-in |
| **State management** | useState/useReducer, Zustand, Jotai | $state/$derived runes (built-in) | ref/reactive (built-in) |
| **TypeScript** | Excellent | Excellent | Excellent |
| **Tooling** | Vite, CRA, Next | Vite (SvelteKit) | Vite (Nuxt) |

Sources: [React vs Vue vs Svelte 2026 (Medium)](https://medium.com/@artur.friedrich/react-vs-vue-vs-svelte-in-2026-a-practical-comparison-for-your-next-side-hustle-e57b7f5f37eb), [Svelte 5 vs React 19 vs Vue 4 (usama.codes)](https://usama.codes/blog/svelte-5-vs-react-19-vs-vue-4-comparison), [FrontendTools Benchmarks](https://www.frontendtools.tech/blog/best-frontend-frameworks-2025-comparison)

**Tradeoff summary:**
- **React** has the most mature ecosystem and the best animation library (Motion). The previous version of this project used React + Vite + Zustand, so there is familiarity. However, it has the largest runtime and most boilerplate.
- **Svelte 5** has the smallest bundle, best raw performance, and simplest state management (runes). Built-in `svelte/transition` and `svelte/animate` cover many animation needs without extra dependencies. But the ecosystem is smaller.
- **Vue 4** is a middle ground — good ecosystem, low learning curve, built-in transitions. Slightly larger than Svelte but smaller than React.

### Animation & Interaction Libraries

For "delightful UX," animations are critical. Options depend on framework choice:

| Library | Size | Framework | Best For |
|---|---|---|---|
| **Motion** (formerly Framer Motion) | ~85KB | React (primary), vanilla JS | Declarative animations, gestures, layout animations |
| **GSAP** | ~78KB | Any | Complex timelines, high-perf tweening |
| **Anime.js** | ~17KB | Any | Lightweight, simple animations |
| **svelte/transition** | 0KB (built-in) | Svelte | Enter/exit transitions, flip animations |
| **Vue Transition** | 0KB (built-in) | Vue | Enter/exit transitions |
| **CSS animations** | 0KB | Any | Simple hover states, transforms |

Sources: [LogRocket Animation Libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/), [GSAP vs Motion (motion.dev)](https://motion.dev/docs/gsap-vs-motion), [Alignify Best Animation Libraries 2026](https://alignify.co/tools/animation-library)

**Key insight:** For a game this size, CSS animations + framework-built-in transitions may be sufficient. A dedicated animation library adds bundle weight but enables more complex effects (e.g., confetti on game win, smooth layout transitions when a sub-board is won).

### Previous Version Analysis

The deleted files in git status reveal the previous implementation used:
- **React 19** with TypeScript
- **Vite** for bundling
- **Zustand** for state management (`src/store/gameStore.ts`)
- **CSS Modules** for styling (`*.module.css`)
- **Vitest** for testing (`engine.test.ts`, `gameStore.test.ts`)
- Component structure: `App`, `MetaBoard`, `SubBoard`, `Cell`, `Controls`, `GameStatus`
- Engine separated from UI: `src/engine/` (types, constants, engine logic, tests)

This architecture was clean and well-separated. The new version can learn from it regardless of framework choice.

---

## Constraints

1. **Pure frontend — no backend.** All game state lives in the browser. No persistence across page refreshes unless localStorage is used.
2. **Local multiplayer only.** Two players on the same device/browser. No networking, no WebSocket, no matchmaking.
3. **Single page application.** No routing needed — the entire game fits on one page.
4. **TypeScript required.** Per `.sniper/config.yaml`, the project language is TypeScript.
5. **npm as package manager.** Per config.
6. **Greenfield.** Previous code is deleted; starting from scratch. No migration concerns.
7. **No AI opponent in scope.** The user specified two-player local multiplayer only.
8. **Browser compatibility.** Modern browsers (Chrome, Firefox, Safari, Edge). No IE11.

---

## Risks

1. **Nested grid complexity on mobile.** A 9x9 grid of interactive cells must be usable on small screens. Touch targets need to be large enough (minimum 44x44px per Apple HIG / 48x48dp per Material Design). On a 375px-wide phone, each cell would be ~35px if the board fills the width — below minimum tap target size. This is a significant UX risk.
   - *Mitigation options:* Allow horizontal scroll, use pinch-to-zoom on sub-boards, or accept that the game is primarily a tablet/desktop experience.

2. **State complexity.** The game state includes 81 cells, 9 sub-board outcomes, meta-board outcome, current player, active sub-board constraint, and game status. This is manageable but requires careful modeling to avoid bugs in edge cases (free move when sent to completed board, detecting draws, etc.).

3. **Draw detection edge case.** Determining when the overall game is a draw (no possible three-in-a-row on meta-board) requires checking if any remaining unfilled sub-boards could change the outcome. A simpler heuristic: the game is drawn when all 9 sub-boards are decided (won or fully filled) and no player has three in a row.

4. **Animation performance.** 81 cells with potential animations (hover states, placement transitions, highlight effects) could cause jank on lower-end devices if not carefully managed. CSS transforms are GPU-accelerated and preferred over layout-triggering properties.

5. **Framework choice lock-in.** If Svelte or Vue is chosen (instead of React), the team may have less ecosystem support for specific needs that arise later. However, for a self-contained game with no backend, this risk is low.

---

## Out of Scope

- **AI opponent / single-player mode.** Not requested; adds significant complexity (minimax/MCTS for Ultimate TTT is a research-level problem).
- **Online multiplayer / networking.** No backend, no WebSocket, no peer-to-peer.
- **User accounts / authentication.** No login, no profiles.
- **Persistent game history.** No saving/loading games across sessions (localStorage persistence is a possible stretch goal but not required).
- **Tournament / ranking system.** Not requested.
- **Sound effects / audio.** Not mentioned in requirements (could be a stretch goal).
- **Move timer / clock.** Not requested.
- **Variant rules.** Only standard rules; no "drawn board counts for both" variant.
- **Internationalization (i18n).** English only.

---

## Open Questions

These are decisions for the architect and product manager:

1. **Which frontend framework?** React 19, Svelte 5, or Vue 4? Key tradeoffs are summarized in the Findings section. The previous version used React — is continuity valued, or is this a fresh start with freedom to choose the best tool?

2. **Animation library or CSS-only?** Should we use a dedicated animation library (Motion, GSAP, Anime.js) for "delightful" UX, or rely on CSS animations + framework built-in transitions? The former enables richer effects but adds bundle size; the latter keeps the app lightweight.

3. **State management approach?** Options vary by framework:
   - React: built-in useState/useReducer, Zustand, Jotai, or Valtio
   - Svelte: built-in $state/$derived runes
   - Vue: built-in ref/reactive, or Pinia
   The game state is moderately complex but self-contained. Built-in solutions are likely sufficient.

4. **Mobile support priority?** Is the game primarily for desktop/tablet, or must it be fully playable on phones? The 9x9 grid presents real tap-target challenges on small screens (see Risks). This affects layout strategy.

5. **Styling approach?** Options: CSS Modules (used in v1), Tailwind CSS, vanilla CSS, CSS-in-JS, or framework-scoped styles (Svelte/Vue built-in). Each has tradeoffs in DX, bundle size, and maintainability.

6. **Testing strategy?** The previous version had unit tests for the engine and store. Should the new version include:
   - Unit tests for game engine logic?
   - Component tests?
   - E2E tests?
   What test runner? (Vitest is the natural choice with Vite.)

7. **Game-over experience?** What happens when a player wins or the game draws? Options range from a simple text message to animated celebrations (confetti, board animation). This affects animation library decisions.

8. **Undo/redo support?** Should players be able to undo moves? This affects state architecture (need immutable state history or command pattern).

9. **Dark mode?** Should the game support dark/light themes? Affects CSS architecture decisions.

10. **Deployment target?** GitHub Pages, Vercel, Netlify, or other? Affects build configuration.
