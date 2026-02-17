# System Architecture: Ultimate Tic-Tac-Toe Sniper

> **Status:** Draft
> **Author:** Planning Team — Architect
> **Date:** 2026-02-17
> **Source:** `docs/prd.md`, `docs/brief.md`, `docs/risks.md`

## 1. Architecture Overview

Ultimate Tic-Tac-Toe Sniper is a fully client-side, static web application. There is no backend, no database, and no server-side logic. The entire application runs in the browser as a single-page React app served from a CDN.

The architecture follows a three-layer separation:

1. **Game Logic Layer** — Pure TypeScript functions with zero framework dependencies. Contains all rules, state transitions, and win/draw detection. Fully unit-testable in isolation.
2. **State Management Layer** — Zustand store that wraps the game engine, providing reactive state to the UI.
3. **UI Layer** — React components that render game state and capture user input.

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              UI Layer (React)                  │  │
│  │                                               │  │
│  │  Game ─┬─ TurnIndicator                       │  │
│  │        ├─ MetaBoard ── SubBoard[] ── Cell[]    │  │
│  │        ├─ GameOverOverlay                      │  │
│  │        └─ NewGameButton                        │  │
│  └──────────────────┬────────────────────────────┘  │
│                     │ reads state / dispatches       │
│  ┌──────────────────▼────────────────────────────┐  │
│  │         State Layer (Zustand)                  │  │
│  │                                               │  │
│  │  gameStore: GameState + actions                │  │
│  └──────────────────┬────────────────────────────┘  │
│                     │ calls pure functions            │
│  ┌──────────────────▼────────────────────────────┐  │
│  │        Game Logic Layer (Pure TS)              │  │
│  │                                               │  │
│  │  types.ts ── engine.ts ── rules.ts             │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         │ Static files served over CDN
         │
┌────────▼────────┐
│  Static Host    │
│  (Vercel /      │
│   Netlify /     │
│   CF Pages)     │
└─────────────────┘
```

**Key architectural decisions:**

- Game logic is separated from React so it can be tested without a DOM and potentially reused if online multiplayer is added later.
- Zustand is used instead of React Context or Redux to avoid unnecessary complexity while still providing reactive state management.
- No external runtime requests — the app works offline after the initial page load.

## 2. Technology Choices

| Component | Choice | Why | Alternatives Considered |
|-----------|--------|-----|------------------------|
| Language | TypeScript 5.x (strict mode) | Type safety catches game logic bugs at compile time; strict mode enforces null checks critical for cell/board state | JavaScript (rejected: too error-prone for nested game state), ReScript (rejected: smaller ecosystem) |
| Frontend | React 18+ | Specified in project brief; component model maps naturally to nested board structure; large ecosystem for tooling | Svelte (rejected: not specified in constraints), Preact (viable but less ecosystem support), Solid (rejected: smaller community) |
| State Management | Zustand | < 2KB gzipped, minimal boilerplate, works with immutable state patterns, no providers needed | Redux Toolkit (rejected: too heavy for single-store app), React Context (rejected: re-render performance issues with 81 cells), Jotai (viable but Zustand is simpler for single store) |
| Build Tool | Vite 5+ | Fast HMR, native TS/React support, tree-shaking, small output bundles, recommended in PRD | Webpack (rejected: slower, more config), Parcel (rejected: less mature TS support), esbuild direct (rejected: no HMR dev server) |
| Styling | CSS Modules | Scoped styles with zero runtime cost, native Vite support, no additional dependencies | Tailwind CSS (viable alternative, adds utility classes), styled-components (rejected: runtime CSS-in-JS adds bundle size), vanilla CSS (rejected: global scope conflicts) |
| Testing | Vitest + React Testing Library | Native Vite integration, fast execution, same API as Jest, RTL encourages accessible component testing | Jest (rejected: requires separate config from Vite), Cypress (overkill for unit tests, useful for E2E if added later) |
| Package Manager | pnpm | Required per project constraints | N/A — constrained |
| Deployment | Static host (Vercel, Netlify, or Cloudflare Pages) | Zero-config static deployment, global CDN, free tier sufficient, automatic HTTPS | GitHub Pages (viable but less CI/CD integration), AWS S3+CloudFront (over-engineered for this scope) |
| Backend | None | No backend required — all logic is client-side, no persistence, no auth | N/A — constrained |
| Database | None | No data persistence by design — game state lives in memory only | N/A — constrained |
| Cache | None | No server-side caching needed; browser caches static assets via CDN headers | N/A |
| Queue | None | No async jobs or background processing | N/A |
| Infrastructure | CDN-delivered static files | No servers to manage, scale, or monitor; inherits host's global edge network | N/A |

## 3. Component Architecture

### 3.1 Game Logic Layer (`src/game/`)

This layer contains pure TypeScript with zero React or DOM dependencies.

#### 3.1.1 `types.ts` — Type Definitions
- **Responsibility:** Define all game-related types and interfaces used across the application.
- **Interfaces:** Exports `Player`, `CellValue`, `SubBoardStatus`, `GameState`, `MoveResult`, `BoardIndex`, `CellIndex`.
- **Dependencies:** None.

#### 3.1.2 `engine.ts` — Game Engine
- **Responsibility:** Execute game state transitions. Given a current state and a move, produce the next state. All functions are pure (no side effects, no mutation).
- **Interfaces:**
  - `createInitialState(): GameState` — Returns a fresh game state.
  - `makeMove(state: GameState, board: BoardIndex, cell: CellIndex): MoveResult` — Validates and applies a move, returns new state or error.
  - `checkSubBoardWin(board: CellValue[]): Player | null` — Checks if a 9-cell board has a winner.
  - `checkSubBoardDraw(board: CellValue[], status: SubBoardStatus): boolean` — Checks if a sub-board is drawn.
  - `checkMetaWin(statuses: SubBoardStatus[]): { winner: Player, line: BoardIndex[] } | null` — Checks if the meta-board has a winner. Returns the winning player and the three board indices forming the winning line.
  - `checkMetaDraw(statuses: SubBoardStatus[]): boolean` — Checks if the overall game is drawn.
- **Dependencies:** `types.ts`

#### 3.1.3 `rules.ts` — Rule Validation
- **Responsibility:** Determine what moves are legal given the current game state.
- **Interfaces:**
  - `isValidMove(state: GameState, board: BoardIndex, cell: CellIndex): boolean` — Returns whether a move is legal.
  - `getActiveBoards(state: GameState): BoardIndex[]` — Returns indices of boards that accept moves.
  - `getNextActiveBoard(cellIndex: CellIndex, subBoardStatuses: SubBoardStatus[]): BoardIndex[] | 'all'` — Determines which board(s) are active after a move.
- **Dependencies:** `types.ts`

### 3.2 State Management Layer (`src/state/`)

#### 3.2.1 `gameStore.ts` — Zustand Store
- **Responsibility:** Wrap the pure game engine in a reactive store. Expose actions that UI components call, and state that UI components read. The store calls engine functions and updates its internal state with the result.
- **Interfaces:**
  - `useGameStore()` — Zustand hook returning current `GameState` plus actions.
  - Actions: `placeMove(board, cell)`, `newGame()`, `resetGame()`.
  - Selectors: `useCurrentPlayer()`, `useActiveBoards()`, `useGameResult()`, `useLastMove()`, `useBoardState(boardIndex)`, `useSubBoardStatus(boardIndex)`.
- **Dependencies:** `zustand`, `src/game/engine.ts`, `src/game/types.ts`

### 3.3 UI Layer (`src/components/`)

#### 3.3.1 `Game.tsx` — Root Game Container
- **Responsibility:** Top-level layout. Renders the turn indicator, meta-board, game-over overlay, and new game button. Handles overall page layout and responsive container sizing.
- **Interfaces:** No props (reads from store directly).
- **Dependencies:** All child components, `gameStore`.

#### 3.3.2 `MetaBoard.tsx` — Meta-Grid
- **Responsibility:** Renders the 3x3 grid of sub-boards. Passes board index and active state to each SubBoard.
- **Interfaces:** No props (reads activeBoards from store).
- **Dependencies:** `SubBoard`, `gameStore`.

#### 3.3.3 `SubBoard.tsx` — Sub-Grid (Memoized)
- **Responsibility:** Renders a single 3x3 grid of cells. Shows won/drawn overlay when sub-board is complete. Highlights when active.
- **Interfaces:** `{ boardIndex: BoardIndex }`
- **Dependencies:** `Cell`, `gameStore`. Wrapped in `React.memo` — re-renders only when its specific board state or active status changes.

#### 3.3.4 `Cell.tsx` — Individual Cell (Memoized)
- **Responsibility:** Renders a single cell. Displays X, O, or empty. Handles click/tap events. Shows last-move indicator.
- **Interfaces:** `{ boardIndex: BoardIndex, cellIndex: CellIndex }`
- **Dependencies:** `gameStore`. Wrapped in `React.memo`.

#### 3.3.5 `TurnIndicator.tsx` — Current Player Display
- **Responsibility:** Shows whose turn it is (Player X or Player O). Always visible without scrolling.
- **Interfaces:** No props (reads from store).
- **Dependencies:** `gameStore`.

#### 3.3.6 `GameOverOverlay.tsx` — End-of-Game Display
- **Responsibility:** Renders when the game ends. Shows winner or draw result. Contains the New Game button.
- **Interfaces:** No props (reads from store).
- **Dependencies:** `gameStore`, `NewGameButton`.

#### 3.3.7 `NewGameButton.tsx` — Reset Trigger
- **Responsibility:** Button that resets game state to initial. No page reload.
- **Interfaces:** No props.
- **Dependencies:** `gameStore`.

### 3.4 Application Entry (`src/`)

#### 3.4.1 `App.tsx` — Application Root
- **Responsibility:** Renders the `Game` component. Minimal wrapper.
- **Dependencies:** `Game`.

#### 3.4.2 `main.tsx` — Entry Point
- **Responsibility:** Mounts React to the DOM.
- **Dependencies:** `React`, `ReactDOM`, `App`.

## 4. Data Models

Since this is a client-side application with no database, data models describe the in-memory state shape.

### 4.1 GameState

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `boards` | `CellValue[][]` | Exactly 9 arrays, each with exactly 9 elements | `CellValue = 'X' \| 'O' \| null`. Index 0-8 maps to sub-boards (left-to-right, top-to-bottom). Inner index 0-8 maps to cells within each sub-board. |
| `subBoardStatus` | `SubBoardStatus[]` | Exactly 9 elements | Each is `'in-progress' \| 'won-x' \| 'won-o' \| 'draw'`. Derived from `boards` but cached to avoid recalculation. |
| `currentPlayer` | `Player` | `'X' \| 'O'` | Alternates after each valid move. X always goes first. |
| `activeBoards` | `number[] \| 'all'` | Array of 0-8 indices, or literal `'all'` | Determines which sub-boards accept moves. `'all'` when sent to a completed board (free move). |
| `gameResult` | `GameResult \| null` | `null` during play | `{ winner: 'X' } \| { winner: 'O' } \| { draw: true } \| null`. Set when game ends. |
| `lastMove` | `Move \| null` | `null` before first move | `{ board: BoardIndex, cell: CellIndex }`. Used for last-move highlighting. |
| `winningLine` | `BoardIndex[] \| null` | `null` unless game won | When the meta-board is won, the three `BoardIndex` values forming the winning line (e.g., `[0, 4, 8]` for a diagonal). Used by UI to visually indicate the winning three-in-a-row on the meta-board (US-010). `null` when game is in progress or drawn. |

### 4.2 Type Definitions

| Type | Definition | Notes |
|------|-----------|-------|
| `Player` | `'X' \| 'O'` | The two players |
| `CellValue` | `Player \| null` | Contents of a single cell |
| `BoardIndex` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | Index into the 3x3 meta-grid |
| `CellIndex` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | Index into a 3x3 sub-grid |
| `SubBoardStatus` | `'in-progress' \| 'won-x' \| 'won-o' \| 'draw'` | Status of a single sub-board |
| `GameResult` | `{ winner: Player } \| { draw: true }` | Overall game outcome |
| `Move` | `{ board: BoardIndex, cell: CellIndex }` | A single move |
| `MoveResult` | `{ success: true, state: GameState } \| { success: false, reason: string }` | Result of attempting a move |

### 4.3 Board Index Mapping

```
Meta-board layout:        Sub-board cell layout:
┌───┬───┬───┐             ┌───┬───┬───┐
│ 0 │ 1 │ 2 │             │ 0 │ 1 │ 2 │
├───┼───┼───┤             ├───┼───┼───┤
│ 3 │ 4 │ 5 │             │ 3 │ 4 │ 5 │
├───┼───┼───┤             ├───┼───┼───┤
│ 6 │ 7 │ 8 │             │ 6 │ 7 │ 8 │
└───┴───┴───┘             └───┴───┴───┘
```

A move on meta-board `board=4`, `cell=2` places a mark in the center sub-board's top-right cell. The next active board becomes board `2` (unless board 2 is already completed, in which case `activeBoards = 'all'`).

### 4.4 Win Detection Patterns

The same 8 winning patterns apply to both sub-boards and the meta-board:

```
Rows:      [0,1,2], [3,4,5], [6,7,8]
Columns:   [0,3,6], [1,4,7], [2,5,8]
Diagonals: [0,4,8], [2,4,6]
```

## 5. API Contracts

**N/A — Static client-side application.**

This application has no backend, no server, and makes no network requests at runtime. There are no API endpoints to define.

The "contract" between layers is the TypeScript type system:

- **UI ↔ State:** Components call store actions (`placeMove`, `newGame`) and read state via Zustand selectors.
- **State ↔ Logic:** The store calls pure engine functions (`makeMove`, `createInitialState`) and stores the returned `GameState`.

These contracts are enforced at compile time by TypeScript strict mode.

## 6. Infrastructure Topology

```
┌──────────────┐     HTTPS      ┌──────────────────┐
│   Browser    │ ◄────────────► │   CDN Edge Node   │
│  (Client)    │                │   (Global)        │
└──────────────┘                └────────┬─────────┘
                                         │
                                         │ Origin pull
                                         │
                                ┌────────▼─────────┐
                                │   Static Host     │
                                │   (Vercel /       │
                                │    Netlify /      │
                                │    CF Pages)      │
                                └────────┬─────────┘
                                         │
                                         │ Deploy on merge
                                         │
                                ┌────────▼─────────┐
                                │   GitHub Actions  │
                                │   CI/CD Pipeline  │
                                └────────┬─────────┘
                                         │
                                         │ Push to main
                                         │
                                ┌────────▼─────────┐
                                │   GitHub Repo     │
                                └──────────────────┘
```

### Deployment Details

| Aspect | Specification |
|--------|--------------|
| Hosting | Vercel (recommended), Netlify, or Cloudflare Pages — all free tier |
| CDN | Included with host (Vercel Edge Network / Netlify CDN / Cloudflare) |
| HTTPS | Automatic via hosting provider |
| Domain | Custom domain optional; default subdomain provided by host |
| Build output | Single `index.html` + hashed JS/CSS bundles in `dist/` |
| Cache strategy | Immutable hashing on JS/CSS assets (long cache TTL); `index.html` with short TTL or `stale-while-revalidate` |
| Estimated bundle | 50-80KB gzipped (React ~45KB + game logic ~5KB + components ~10-20KB) |

### CI/CD Pipeline (GitHub Actions)

```yaml
# Triggered on push to main and pull requests
Steps:
  1. Install dependencies (pnpm install --frozen-lockfile)
  2. Lint (eslint)
  3. Type check (tsc --noEmit)
  4. Unit tests (vitest run)
  5. Build (vite build)
  6. Deploy to static host (on main branch only)
```

### Cost Estimate

| Resource | Cost |
|----------|------|
| Static hosting (free tier) | $0/month |
| Custom domain (optional) | ~$12/year |
| CI/CD (GitHub Actions free tier) | $0/month |
| **Total** | **$0-1/month** |

## 7. Cross-Cutting Concerns

### 7.1 Authentication & Authorization

**N/A.** No authentication system exists or is planned for v1. No user accounts, sessions, tokens, or identity management. All game state is anonymous and ephemeral.

### 7.2 Logging & Monitoring

**Minimal for v1:**

- **Development:** Console logging via `console.warn` / `console.error` for invalid state transitions during development. Stripped in production build via Vite's dead-code elimination when wrapped in `import.meta.env.DEV` checks.
- **Production:** No server-side logging (no server). No analytics or error tracking in v1 (per PRD scope: zero data collection). Browser console errors visible to developers during manual testing.
- **Future consideration:** Sentry free tier for client-side error tracking could be added post-v1 if needed.

### 7.3 Error Handling

| Layer | Strategy |
|-------|----------|
| Game Logic | Functions return `MoveResult` with success/failure rather than throwing. Invalid moves return `{ success: false, reason: string }`. No exceptions for expected game states. |
| State Layer | Store validates action results. Invalid moves are silently ignored (no user-facing error — the UI already prevents invalid clicks via active board highlighting). |
| UI Layer | React Error Boundary at the `App` level to catch unexpected render errors. Displays a "Something went wrong — click to restart" fallback rather than a blank screen. |
| Build | TypeScript strict mode catches type errors at compile time. ESLint catches common patterns. |

### 7.4 Configuration Management

**Minimal configuration needed:**

- **Build-time config:** Vite environment variables (`import.meta.env`) for any build-specific values (e.g., base URL if deployed to a subdirectory).
- **Runtime config:** None. The game has no configurable options in v1 (no themes, no settings, no feature flags).
- **Game constants:** Defined in `src/game/types.ts` or a `constants.ts` file (board size = 3, win patterns, etc.). Hardcoded since Ultimate Tic-Tac-Toe rules are fixed.

## 8. Non-Functional Requirements

| Requirement | Target | Strategy |
|-------------|--------|----------|
| First Contentful Paint (FCP) | < 1.5s on 4G | Small bundle size (< 200KB gzipped), CDN delivery, no blocking external resources, no web fonts at runtime |
| Time to Interactive (TTI) | < 2.0s on 4G | Minimal JS execution on load, no data fetching, game ready as soon as React hydrates |
| Input response latency | < 50ms tap-to-visual | Synchronous state transitions, React.memo on Cell/SubBoard to minimize re-render scope, no async operations in move path |
| JS bundle size | < 200KB gzipped | Vite tree-shaking, no heavy dependencies (Zustand < 2KB, React ~45KB), no CSS-in-JS runtime |
| Browser support | Chrome 90+, Safari 15+ | Target only these two browsers per constraints. Use autoprefixer for CSS. No polyfills needed for this browser range. |
| Minimum viewport | 320px width | CSS Grid with `minmax()` and viewport-relative units. Tested on iPhone SE (375px logical, 320px considered). |
| Touch targets | Min 44x44px | CSS ensures all Cell components meet this minimum. Verified across breakpoints. |
| Color contrast | WCAG 2.1 AA | 4.5:1 for text, 3:1 for UI components. Validated with contrast checker tooling. Active board highlighting must be distinguishable without relying solely on color. |
| Keyboard accessibility | Full game playable via keyboard | Tab navigation between cells, Enter/Space to place mark, visible focus indicators. ARIA labels on cells (`aria-label="Board 4, Cell 2, empty"`). |
| Offline capability | Fully functional after initial load | No runtime network requests. Service worker optional (not in v1 scope, but possible future enhancement). |
| Test coverage | 100% on game logic | Vitest covers all functions in `engine.ts` and `rules.ts`. Edge cases: tied boards, free moves, full draws, cascading wins. |
| Availability | 99.9%+ | Inherited from static hosting provider SLA. No application-level failure modes (no server, no database). |
| Data retention | None | No data stored. Game state exists only in browser memory. Closing tab = complete reset. |

## 9. Migration & Deployment Strategy

### Initial Deployment

1. **Repository setup:** GitHub repository with `main` branch as production.
2. **CI pipeline:** GitHub Actions workflow runs on every push/PR: install → lint → typecheck → test → build. All third-party actions pinned to commit SHAs (not tags) to prevent supply chain attacks.
3. **Hosting connection:** Connect repository to Vercel/Netlify/Cloudflare Pages. Auto-deploy `main` branch.
4. **Preview deployments:** PR branches get preview URLs automatically (built-in feature of Vercel/Netlify).

### Deployment Process

```
Developer pushes to feature branch
  → GitHub Actions: lint + typecheck + test + build
  → Static host: preview deployment with unique URL
  → PR review
  → Merge to main
  → GitHub Actions: lint + typecheck + test + build
  → Static host: production deployment
  → CDN cache invalidation (automatic)
```

### Rollback Strategy

- **Instant rollback:** All static hosts support reverting to a previous deployment with one click in the dashboard.
- **No database migrations:** Nothing to roll back beyond the static files.
- **Immutable deployments:** Each deployment is a complete snapshot of the app.

### Future Migration Path (if online multiplayer added post-v1)

The game logic layer (`src/game/`) can be extracted into a shared package and used on both client and server. The architecture explicitly separates game logic from UI to enable this:

- `src/game/` → shared package (runs in browser and Node.js)
- Server would call the same `makeMove()` and `checkMetaWin()` functions for authoritative game state
- Client would become a thin renderer that receives state from the server

This migration path does NOT affect v1 design decisions. It is noted here only to confirm the architecture does not accidentally block future extensibility.

## 10. Security Architecture

### Threat Model

This application has a minimal attack surface:

| Threat | Risk Level | Analysis |
|--------|-----------|----------|
| XSS (Cross-Site Scripting) | **None** | No user-generated content. No text inputs, no chat, no player names. All rendered content is hardcoded in components. |
| CSRF | **None** | No backend, no forms submitting to a server, no cookies. |
| Data exfiltration | **None** | No user data exists to exfiltrate. No cookies, no localStorage (for tracking), no analytics. |
| Client-side cheating | **Accepted** | Players can modify game state via browser DevTools. This is acceptable for local multiplayer where both players share the same device and trust is implicit. |
| Supply chain (npm) | **Low** | Minimal dependencies (React, Zustand, Vite). Run `pnpm audit` in CI. Lock dependency versions. |
| CDN/hosting compromise | **Very Low** | Mitigated by using reputable hosts (Vercel/Netlify/CF) with automatic HTTPS and SRI support. |

### Security Controls

| Control | Implementation |
|---------|---------------|
| HTTPS | Enforced by static hosting provider (automatic TLS certificates) |
| Content Security Policy | Deploy with strict CSP headers: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'self'` — no external resources, no network requests, no framing, no form submissions |
| No external requests | Zero third-party scripts, fonts, images, or analytics loaded at runtime. Verified by CSP (`connect-src 'none'`) and by auditing the build output. |
| No data collection | No cookies set, no localStorage used for tracking, no fingerprinting. Privacy by architecture. |
| Dependency auditing | `pnpm audit` runs in CI pipeline. Dependabot or Renovate configured for automated dependency updates. Pin GitHub Actions to commit SHAs (not tags) to prevent supply chain attacks through compromised actions. |
| Subresource Integrity | Static assets served with SRI hashes where supported by the hosting provider. |
| X-Frame-Options | Set to `DENY` — no legitimate reason for the game to be embedded in an iframe. CSP `frame-ancestors 'none'` provides the same protection in modern browsers. |
| Referrer-Policy | Set to `no-referrer` — the application makes zero external requests and has no outbound links, so no referrer information should be leaked. Aligns with zero-data-collection principle. |
| X-Content-Type-Options | Set to `nosniff` — prevents MIME type sniffing. |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=()` — explicitly denies device API access the game does not need. |
| Cross-Origin-Opener-Policy | Set to `same-origin` — isolates the browsing context. |
| Cross-Origin-Resource-Policy | Set to `same-origin` — prevents cross-origin resource loading. |
| X-XSS-Protection | Set to `0` — disables legacy XSS auditor which can introduce vulnerabilities. CSP provides modern XSS protection. |

### Privacy

This application collects zero user data. There are no cookies, no analytics, no tracking scripts, no localStorage usage for anything beyond potential future game state (not in v1), and no server-side logging. The application is private by design — there is nothing to protect because nothing is collected.

No GDPR, CCPA, or other privacy regulation applies to v1 because no personal data is processed.

## 11. Directory Structure

```
ultimate-tic-tac-toe-sniper/
├── public/
│   └── favicon.ico
├── src/
│   ├── game/                    # Pure game logic (no React)
│   │   ├── types.ts             # All type definitions
│   │   ├── engine.ts            # Game state transitions
│   │   ├── rules.ts             # Move validation & active board logic
│   │   └── __tests__/
│   │       ├── engine.test.ts
│   │       └── rules.test.ts
│   ├── state/                   # State management
│   │   └── gameStore.ts         # Zustand store
│   ├── components/              # React UI components
│   │   ├── Game.tsx
│   │   ├── Game.module.css
│   │   ├── MetaBoard.tsx
│   │   ├── MetaBoard.module.css
│   │   ├── SubBoard.tsx
│   │   ├── SubBoard.module.css
│   │   ├── Cell.tsx
│   │   ├── Cell.module.css
│   │   ├── TurnIndicator.tsx
│   │   ├── TurnIndicator.module.css
│   │   ├── GameOverOverlay.tsx
│   │   ├── GameOverOverlay.module.css
│   │   └── NewGameButton.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── main.tsx
│   └── index.css                # Global styles (CSS reset, variables)
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts (or in vite.config.ts)
├── eslint.config.js
└── .github/
    └── workflows/
        └── ci.yml
```
