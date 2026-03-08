# Discovery Specification: Ultimate Tic-Tac-Toe

**Protocol:** SNPR-20260307-b7e4
**Phase:** Discover
**Date:** 2026-03-07
**Status:** Draft

---

## Overview

Ultimate Tic-Tac-Toe is a strategic board game that extends standard Tic-Tac-Toe into a nested, two-level structure. The game board consists of a 3x3 grid of "sub-boards," each of which is itself a 3x3 Tic-Tac-Toe grid. This creates 81 total cells across 9 sub-boards.

The key mechanic that distinguishes Ultimate Tic-Tac-Toe from simply playing nine separate games is the **send rule**: the cell a player chooses within a sub-board determines which sub-board the opponent must play in next. This constraint creates deep strategic interdependencies between the sub-boards.

**Product Vision:** Build a polished, client-side web application for two players to play Ultimate Tic-Tac-Toe on the same device. The emphasis is on a modern, delightful user experience with clear visual feedback about game state, legal moves, and board ownership.

---

## Requirements

### FR-1: Game Rules Engine

The game engine must implement the complete Ultimate Tic-Tac-Toe ruleset:

1. **Board Structure:** A 3x3 meta-board composed of nine 3x3 sub-boards, totaling 81 playable cells.

2. **Turn Alternation:** Player X always moves first. Players alternate turns (X, O, X, O, ...).

3. **The Send Rule (core mechanic):**
   - When a player places their mark in a cell at position (row, col) within a sub-board, the opponent's next move MUST be played in the sub-board located at position (row, col) on the meta-board.
   - Example: If Player X plays in the top-right cell (row=0, col=2) of any sub-board, Player O must next play somewhere in the top-right sub-board of the meta-board.

4. **Free Move Exception:**
   - If the send rule would direct a player to a sub-board that is already **won** (by either player) or **drawn** (all cells filled with no winner), that player may instead play in **any sub-board that is still active** (not won and not drawn).
   - The first move of the game is also a free move (Player X may play in any cell on the entire board).

5. **Sub-Board Victory:** A sub-board is won when a player achieves three-in-a-row (horizontally, vertically, or diagonally) within that sub-board, following standard Tic-Tac-Toe rules. Once won, no further moves can be made in that sub-board.

6. **Sub-Board Draw:** A sub-board is drawn when all 9 cells are filled and no player has three-in-a-row. Once drawn, no further moves can be made in that sub-board. A drawn sub-board counts for neither player on the meta-board.

7. **Meta-Board Victory (Game Win):** The overall game is won when a player wins three sub-boards in a row on the meta-board (horizontally, vertically, or diagonally), following standard Tic-Tac-Toe winning patterns.

8. **Game Draw:** The game is drawn if all nine sub-boards are resolved (won or drawn) and no player has achieved three-in-a-row on the meta-board. **Open question:** Some variants also declare a draw if no legal moves remain that could change the outcome -- see Open Questions.

### FR-2: Move Validation

- The engine must reject illegal moves (clicking on an occupied cell, clicking in a sub-board the player is not allowed to play in, clicking in a won/drawn sub-board).
- Only valid cells should be interactive; invalid targets should be visually distinct and non-clickable.

### FR-3: Visual Game State

- **Active sub-board highlighting:** Clearly indicate which sub-board(s) the current player must (or may) play in.
- **Turn indicator:** Display whose turn it is (X or O) prominently.
- **Last move indicator:** Highlight the most recently played cell so both players can track what just happened.
- **Sub-board ownership overlay:** When a sub-board is won, display a large X or O overlay on that sub-board. When drawn, display a distinct visual treatment (e.g., greyed out, hatched pattern).
- **Winning line on meta-board:** When the game ends, show the winning three-in-a-row on the meta-board.

### FR-4: Game Flow

- **New Game / Reset:** A button or action to start a fresh game at any time.
- **Game Over State:** When the game ends (win or draw), display the result clearly with an option to start a new game.
- **Move history (optional/stretch):** Ability to review moves played. This is a nice-to-have, not a core requirement.

### FR-5: Local Multiplayer

- Two human players take turns on the same browser window/tab.
- No network, accounts, or authentication required.
- No need to persist game state across page reloads (ephemeral is acceptable). **Open question:** Should we persist state to localStorage for convenience?

### FR-6: User Experience

- Smooth, responsive interactions (hover states, click feedback, transitions).
- Clean, modern visual design.
- The board should be readable and playable without confusion about which level of nesting the player is interacting with.
- Clear visual hierarchy between the meta-board grid and the sub-board grids.

---

## Non-Functional Requirements

### NFR-1: Performance

- The application must render and respond to interactions at 60fps on modern hardware.
- Initial page load (time to interactive) should be under 2 seconds on a typical broadband connection.
- Bundle size should be kept small (target: under 200KB gzipped for all assets) since this is a simple game.

### NFR-2: Browser Support

- Must work on the latest two major versions of Chrome, Firefox, Safari, and Edge.
- Must work on mobile Safari (iOS) and Chrome (Android) for tablet-sized screens and above.
- Phone-sized screens are a stretch goal (the 9x9 grid is challenging on small displays).

### NFR-3: Accessibility

- Keyboard navigable: players should be able to play the entire game using only a keyboard (Tab, Arrow keys, Enter/Space).
- Screen reader support with appropriate ARIA labels for cells, sub-boards, turn state, and game outcome.
- Sufficient color contrast ratios (WCAG 2.1 AA minimum).
- Game state announcements for screen readers (whose turn, which sub-board is active, game result).

### NFR-4: Code Quality

- TypeScript with strict mode enabled.
- Comprehensive unit tests for the game engine (rule validation, win detection, send rule logic, edge cases).
- Component tests for interactive UI elements.
- Linting and formatting enforced (ESLint + Prettier or equivalent).

### NFR-5: Deployability

- Static site deployable to any CDN/static host (GitHub Pages, Vercel, Netlify, etc.).
- Single `npm run build` command produces a deployable artifact.
- No server-side runtime required.

---

## Out of Scope

The following are explicitly NOT part of this project:

- **AI / Computer Opponent:** No single-player mode against a bot.
- **Online Multiplayer:** No WebSocket, peer-to-peer, or server-based multiplayer.
- **User Accounts / Authentication:** No login, profiles, or persistent identity.
- **Backend / Database:** Entirely client-side; no API server, no database.
- **Game Variants:** No configurable rule variants (e.g., 4x4 sub-boards, different win conditions).
- **Chat / Social Features:** No in-game chat or social sharing.
- **Leaderboards / Statistics:** No win/loss tracking across sessions.
- **Undo/Redo:** Not required (could be a future enhancement).
- **Replay / Export:** No game replay or move export functionality.
- **Internationalization:** English only for the initial release.
- **Native Mobile App:** Web only; no React Native, Capacitor, or similar.

---

## Technical Options

### Option A: React (with Vite)

| Aspect | Assessment |
|--------|-----------|
| **Ecosystem** | Largest ecosystem; vast library selection. Extensive community resources and examples. |
| **TypeScript** | Excellent TS support. First-class types for components, hooks, state. |
| **State Management** | Built-in useState/useReducer for simple state. Zustand, Jotai, or Redux for structured state. useReducer is a natural fit for game state machines. |
| **Learning Curve** | Most widely known framework; likely familiar to contributors. |
| **Bundle Size** | ~45KB gzipped (react + react-dom). Larger than alternatives but still well within budget. |
| **Testing** | Mature ecosystem: Vitest + React Testing Library. Well-documented patterns. |
| **Tradeoffs** | Larger bundle than Svelte/Preact. Virtual DOM overhead is irrelevant for this app's complexity. Most "safe" choice. |

### Option B: Svelte (with SvelteKit or Vite)

| Aspect | Assessment |
|--------|-----------|
| **Ecosystem** | Smaller than React but growing. Fewer third-party libraries. |
| **TypeScript** | Good TS support (Svelte 5+ has improved this significantly). |
| **State Management** | Built-in reactivity with runes ($state, $derived). No external state library needed. Very clean for game state. |
| **Learning Curve** | Less commonly known. Simpler mental model but unfamiliar syntax. |
| **Bundle Size** | Compiles away the framework; smallest runtime footprint (~2-5KB). |
| **Testing** | Vitest + Svelte Testing Library. Less mature than React's testing ecosystem. |
| **Tradeoffs** | Smallest bundle. Cleanest reactivity model for game state. Fewer developers know it. Smaller ecosystem for edge cases. |

### Option C: Vue 3 (with Vite)

| Aspect | Assessment |
|--------|-----------|
| **Ecosystem** | Second-largest ecosystem. Good library availability. |
| **TypeScript** | Good TS support with Composition API and `<script setup>`. |
| **State Management** | Built-in Composition API reactivity (ref, reactive, computed). Pinia for structured stores. |
| **Learning Curve** | Widely known, especially internationally. Template syntax is approachable. |
| **Bundle Size** | ~33KB gzipped. Smaller than React, larger than Svelte. |
| **Testing** | Vitest (created by Vue team) + Vue Testing Library. Solid ecosystem. |
| **Tradeoffs** | Middle ground in most dimensions. Template syntax may feel less natural for complex game board rendering. |

### Option D: Preact (with Vite)

| Aspect | Assessment |
|--------|-----------|
| **Ecosystem** | API-compatible with React; can use many React libraries via preact/compat. |
| **TypeScript** | Good TS support. |
| **State Management** | Same patterns as React (hooks, signals). Preact Signals is a lightweight reactive option. |
| **Learning Curve** | Nearly identical to React. |
| **Bundle Size** | ~4KB gzipped (without compat layer). Significantly smaller than React. |
| **Testing** | Can use same testing tools as React with compat layer. |
| **Tradeoffs** | Tiny bundle with React API familiarity. Some React libraries may have subtle incompatibilities. Smaller community for Preact-specific issues. |

### Option E: Vanilla TypeScript (with Vite)

| Aspect | Assessment |
|--------|-----------|
| **Ecosystem** | No framework dependency. Full control. |
| **TypeScript** | Native TS; no framework types to learn. |
| **State Management** | Must build own reactivity/rendering. Could use a small state library. |
| **Learning Curve** | Requires more architectural decisions upfront. DOM manipulation code can become verbose. |
| **Bundle Size** | Zero framework overhead. Absolute smallest possible bundle. |
| **Testing** | Vitest for logic. DOM testing requires more setup (jsdom/happy-dom). |
| **Tradeoffs** | No framework overhead at all. Requires building UI update patterns from scratch. Higher risk of spaghetti code without disciplined architecture. Could be elegant for a game this simple, or could become unwieldy. |

### Build Tool

**Vite** is the recommended build tool across all framework options. It is the current standard for frontend projects: fast dev server with HMR, optimized production builds with Rollup, first-class TypeScript support, and framework-agnostic.

### Test Runner Options

| Runner | Notes |
|--------|-------|
| **Vitest** | Built on Vite; fastest setup, native TS/ESM support, Jest-compatible API. Recommended. |
| **Jest** | Industry standard but requires more configuration for ESM/TS. Slower. |
| **Playwright/Cypress** | For E2E testing. Overkill for initial scope but could be added later. |

### CSS / Styling Options

| Approach | Notes |
|----------|-------|
| **CSS Modules** | Scoped styles, zero runtime, works with all frameworks. Simple and sufficient. |
| **Tailwind CSS** | Utility-first. Fast iteration. Adds build dependency. Good for rapid prototyping. |
| **Vanilla CSS (with custom properties)** | Zero overhead. Full control. Requires more manual organization. |
| **CSS-in-JS (styled-components, etc.)** | Runtime overhead. Less relevant for modern approaches. Not recommended for this project. |

**Fact:** The SNIPER config specifies TypeScript and npm as locked-in decisions (`.sniper/config.yaml`, lines 67 and 73). All other stack choices are null/undecided.

---

## Open Questions

These require input from the architect and/or product owner:

1. **Framework Selection:** Which frontend framework should be used? (See Technical Options above for tradeoffs.)

2. **State Persistence:** Should game state survive page reloads via localStorage? This is low effort to implement but adds a small amount of complexity (serialization, version migration if state shape changes).

3. **Draw Detection Nuance:** Should the game declare a draw only when all 9 sub-boards are resolved, or should it also detect "unwinnable" states where neither player can achieve three-in-a-row on the meta-board even with remaining moves? The latter is significantly more complex to implement.

4. **Mobile Phone Support:** The 9x9 nested grid is challenging on phone-sized screens (<400px). Should phone support be a hard requirement, a stretch goal, or explicitly excluded? Options include pinch-to-zoom, a zoomed sub-board view, or accepting that phones are not ideal.

5. **Animation/Polish Level:** How much animation is desired? Options range from minimal (instant state changes) to moderate (smooth transitions, piece placement effects) to elaborate (particle effects, sound). This affects scope significantly.

6. **Sound Effects:** Should the game include audio feedback (click sounds, win fanfare)? Adds polish but also adds asset management and user preference handling (mute toggle).

7. **Theme / Color Scheme:** Should the app support dark mode? Should it match a specific design system or brand? Or is a clean default theme sufficient?

8. **Deployment Target:** Where will this be hosted? This affects build configuration (base paths, etc.) minimally but is good to decide early.

---

## Risks

### R1: Nested Board UX Confusion (Likelihood: Medium, Impact: High)

**Risk:** Players may struggle to understand which sub-board they are targeting and which sub-board they are being sent to. The nested structure can be visually confusing.

**Evidence:** This is a well-known UX challenge with Ultimate Tic-Tac-Toe implementations. The game's core mechanic (send rule) requires constant awareness of two coordinate systems (position within sub-board and position on meta-board).

**Mitigation:** Strong visual highlighting of the active sub-board(s), clear hover states showing which sub-board a move would send the opponent to, and possibly a brief in-app tutorial or rules reference.

### R2: Mobile Responsiveness (Likelihood: High, Impact: Medium)

**Risk:** Fitting a 9x9 nested grid with clear visual hierarchy onto small screens is inherently difficult. Touch targets may be too small on phones.

**Evidence:** 81 cells plus sub-board borders, overlays, and meta-board structure must fit legibly on screen. Minimum touch target size per WCAG is 44x44 CSS pixels, which for 9 columns requires at least 396px of grid width alone.

**Mitigation:** Prioritize tablet and desktop. For phones, consider a zoomed view that shows one sub-board at a time, or accept reduced usability on very small screens.

### R3: Accessibility Complexity (Likelihood: Medium, Impact: Medium)

**Risk:** Making a nested, spatially-oriented board game fully accessible to screen readers and keyboard-only users is non-trivial. The two-level navigation (meta-board then sub-board) needs careful ARIA structure.

**Mitigation:** Use semantic HTML (tables or grids with proper roles), ARIA labels for each cell (e.g., "Sub-board top-left, cell center, empty"), and live regions for announcing game state changes. Plan for this from the start rather than retrofitting.

### R4: Game Engine Edge Cases (Likelihood: Medium, Impact: Medium)

**Risk:** The interaction between the send rule, won sub-boards, drawn sub-boards, and the free move exception creates edge cases that are easy to implement incorrectly. For example: what happens when a move sends the opponent to a just-won sub-board (won by that very move)?

**Mitigation:** Comprehensive unit test suite covering all edge cases. Specifically test: send to won board (triggers free move), send to drawn board (triggers free move), all boards won/drawn (game end), simultaneous sub-board win and game win.

### R5: Scope Creep (Likelihood: High, Impact: Medium)

**Risk:** Features like undo, move history, AI opponent, and online play are natural extensions that could derail the initial build.

**Mitigation:** The Out of Scope section explicitly excludes these. The architecture should be clean enough to allow future extension, but implementation should stop at the defined scope.
