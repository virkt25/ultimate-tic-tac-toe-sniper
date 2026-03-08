# Code Review Report: Ultimate Tic-Tac-Toe

**Protocol ID:** SNPR-20260307-c8a1
**Reviewer:** retro-analyst (code reviewer agent)
**Date:** 2026-03-07
**Branch:** sniper-3.2.1

---

## 1. Executive Summary

The implementation is **substantially complete** and faithfully follows the spec, PRD, and architecture plan. All 39 unit tests pass, TypeScript compiles with zero errors in strict mode, and the production build succeeds. The game engine is pure, well-tested, and correctly separated from the UI layer. The component tree matches the planned architecture. A few deviations from spec naming exist but are intentional improvements. Two blocking issues and several suggestions are identified below.

**Overall Risk Score: LOW** (2/10)

---

## 2. Dimension 1: Scope Validation

### 2.1 Story-by-Story Acceptance Criteria Audit

#### S01: Project Scaffolding -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | package.json with React 19, Zustand, Vite, Vitest, ESLint, Prettier | PASS | All present |
| 2 | tsconfig files with strict mode | PASS | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` all present; `"strict": true` |
| 3 | `npm run dev` starts Vite | PASS | Script defined |
| 4 | `npm test` runs Vitest with zero failures | PASS | 39/39 pass |
| 5 | `npm run build` produces dist/ | PASS | Verified: 3 files in dist/ |
| 6 | Directory structure matches plan | PASS | `src/engine/`, `src/store/`, `src/components/`, `main.tsx`, `global.css`, `vite-env.d.ts` |
| 7 | global.css with CSS custom properties and clamp() | PASS | All tokens defined |
| 8 | eslint.config.js and .prettierrc | PASS | Both present |

#### S02: Game Types and Constants -- PASS (with naming deviations)

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | types.ts exports Player, CellState, BoardResult, Move, GameState | PARTIAL | Exported as `CellValue` (not `CellState`), `SubBoardStatus` (not `BoardResult`), no standalone `Move` type. See reconciliation below. |
| 2 | GameState includes boards, boardResults, currentPlayer, activeBoard, winner, lastMove, moveHistory | PASS | All fields present under slightly different names: `board`, `subBoardStatus`, `activeSubBoard`, `gameOutcome`. Semantically equivalent. |
| 3 | WINNING_LINES constant with 8 patterns | PASS | Exported as `WIN_PATTERNS` -- same 8 triplets |
| 4 | createInitialState() returns valid GameState | PASS | In `engine.ts` (not `constants.ts` as planned) but correctly exported |
| 5 | Flat 0-8 indexing | PASS | `SubBoardIndex` and `CellIndex` use 0-8 union types |

#### S03: Game Engine Core -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | makeMove returns new state with mark, toggled player, updated history | PASS | |
| 2 | activeBoard set to move.cellIndex for unresolved target | PASS | |
| 3 | activeBoard null when sent to resolved board | PASS | |
| 4 | isValidMove rejects invalid moves correctly | PASS | |
| 5 | getValidBoards returns [activeBoard] when constrained | PASS | |
| 6 | getValidBoards returns all open boards on free choice | PASS | |
| 7 | All functions are pure (no mutations) | PASS | Verified via test and code inspection |

#### S04: Win Detection -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | checkBoardWin detects all 8 winning lines | PASS | Tested for both X and O |
| 2 | checkBoardWin returns null for no winner | PASS | |
| 3 | checkBoardDraw detects full board with no winner | PASS | |
| 4 | checkBoardDraw returns false for incomplete/won boards | PASS | |
| 5 | Meta-board win sets winner | PASS | Via `gameOutcome` |
| 6 | All-resolved no-winner sets draw | PASS | |
| 7 | Unresolved keeps winner null | PASS | |

#### S05: Game Engine Tests -- PASS (with one gap)

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Tests for all engine functions | PASS | `makeMove`, `isValidMove`, `getValidBoards`, `checkBoardWin`, `checkBoardDraw`, `getValidMoves`, `getWinningLine` all tested |
| 2 | All 8 winning patterns tested for both players | PASS | |
| 3 | Sent-to-won-board edge case | PASS | |
| 4 | Meta-board win detection | PASS | |
| 5 | Game draw detection | PASS | |
| 6 | Undo verification | PASS | Replay-based undo tested |
| 7 | >= 90% coverage | UNKNOWN | `@vitest/coverage-v8` not installed. See blocking issue. |

**Note:** `undoMove` is not an engine function -- undo is implemented in the store via replay. The engine test file tests the replay pattern directly (describe "undo via replay"). This is correct per ADR-4.

#### S06: Board Rendering -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | MetaBoard renders 3x3 grid of SubBoards | PASS | CSS grid `repeat(3, 1fr)` |
| 2 | SubBoard renders 3x3 grid of Cells | PASS | |
| 3 | Won sub-board shows overlay with winner mark | PASS | `.overlay` + `.overlayX`/`.overlayO` |
| 4 | Drawn sub-board shows distinct visual | PASS | `.overlayDraw` with muted treatment |
| 5 | Cell renders as `<button>` | PASS | |
| 6 | Thicker separation between sub-boards vs cells | PASS | `--gap-meta` > `--gap-sub` |
| 7 | App mounts GameStatus, MetaBoard, Controls centered | PASS | |

#### S07: Game Interaction -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Click valid cell places mark and toggles turn | PASS | |
| 2 | Active sub-board highlighted | PASS | `.active` class with border + background |
| 3 | Free choice highlights all open boards | PASS | `getValidBoards()` returns all playing boards |
| 4 | Invalid cells disabled and unclickable | PASS | `disabled={!isValid}` |
| 5 | GameStatus updates on move | PASS | Reads from store reactively |
| 6 | Winner announcement | PASS | "Player X wins!" / "Player O wins!" |
| 7 | Draw declaration | PASS | "It's a draw!" |
| 8 | Hover effect on playable cells | PASS | `.cell.valid:hover` |

#### S08: Visual Polish -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Mark placement scale animation | PASS | `markAppear` keyframe, 200ms (spec said 150ms -- minor) |
| 2 | Win overlay fade-in | PASS | `overlayFadeIn` 300ms |
| 3 | Active board background transition | PASS | `transition: ... var(--transition-normal)` |
| 4 | High-contrast player colors | PASS | Blue (#3b82f6) and Red (#ef4444) |
| 5 | Muted inactive boards | PASS | `opacity: 0.55` on `.inactive` |
| 6 | Clean modern aesthetic | PASS | Dark theme, consistent tokens |

#### S09: Game Controls -- PASS

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | New Game resets to initial state | PASS | `resetGame()` calls `createInitialState()` |
| 2 | Undo reverts to previous state | PASS | Replay-based via `undoMove()` in store |
| 3 | Undo disabled when no moves | PASS | `disabled={moveCount === 0}` |
| 4 | Undo restores previous turn, activeBoard, results | PASS | Full state replay |
| 5 | Undo reverts sub-board win | PASS | Replay naturally handles this |
| 6 | Controls below the board | PASS | Rendered after `<main>` in App |

#### S10: Responsive and Accessibility -- PASS (with one caveat)

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | No layout breakage at 320/768/1440px | PASS | clamp() sizing, max-width 720px, fluid gaps |
| 2 | Cell sizes use clamp() 28px-48px | PARTIAL | Default: `clamp(32px, 7vw, 56px)`, mobile: `clamp(28px, 9vw, 44px)`. Min is 28px on mobile, max exceeds 48px on desktop. See suggestion. |
| 3 | Keyboard navigation Tab/Shift-Tab | PASS | Cells are `<button>` elements, naturally focusable |
| 4 | Enter/Space places mark | PASS | Native button behavior |
| 5 | ARIA labels on cells | PASS | Descriptive labels with board position, cell position, value, availability |
| 6 | aria-live="polite" on GameStatus | PASS | `role="status"` + `aria-live="polite"` |
| 7 | WCAG AA contrast | PASS | Dark background (#0f172a) with light text (#f1f5f9) provides >7:1 ratio. Blue/red on dark surface both >3:1 for UI components. |
| 8 | Min 28px touch targets | PASS | Min cell size is 28px via clamp() |

---

## 3. Dimension 2: Standards Enforcement

### 3.1 Architecture Adherence

- **ADR-1 (Pure engine):** PASS. Engine has zero React/store imports.
- **ADR-2 (Flat indexing):** PASS. Uses 0-8 everywhere with typed union types for added safety.
- **ADR-3 (Zustand):** PASS. Thin store wrapper with selectors.
- **ADR-4 (Replay-based undo):** PASS. Store `undoMove` replays `moveHistory.slice(0, -1)`.
- **ADR-5 (CSS Modules + custom properties):** PASS.

### 3.2 Code Quality

- TypeScript strict mode enabled with additional lint rules (`noUnusedLocals`, `noUnusedParameters`).
- ESLint configured with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins.
- Prettier configured with consistent style.
- Zero TypeScript errors on `tsc -b`.
- Clean separation of concerns: types -> constants -> engine -> store -> components.

### 3.3 Testing

- 39 tests across 2 test files, all passing.
- Engine tests cover: initial state, win detection (all 8 patterns, both players), draw detection, move validation, send rule, free move on won/drawn board, meta-board win/draw, full game sequence, undo via replay.
- Store tests cover: initial state, make move, reset, undo, move validation.

---

## 4. Dimension 3: Risk Scoring

| Risk Area | Score | Notes |
|-----------|-------|-------|
| Correctness | LOW | All game rules implemented correctly; edge cases tested |
| Performance | LOW | Minimal bundle (200KB gzipped 63KB); no unnecessary re-renders via Zustand selectors |
| Security | N/A | Client-only game, no user input beyond clicks |
| Maintainability | LOW | Clean architecture, typed everywhere, well-separated concerns |
| Accessibility | LOW-MEDIUM | ARIA labels present, keyboard nav works, contrast OK. No Lighthouse score verified (would need browser). |
| Test coverage | MEDIUM | No coverage report due to missing `@vitest/coverage-v8`. See blocking issue. |

---

## 5. Findings

### BLOCKING

**B1: Missing `@vitest/coverage-v8` dependency**
- S05 AC7 requires >= 90% engine test coverage. The coverage tool is not installed (`@vitest/coverage-v8` missing from devDependencies), so coverage cannot be verified.
- **Fix:** `npm install -D @vitest/coverage-v8` and add a `test:coverage` script.
- **Impact:** Cannot verify S05 AC7 or PRD success metric (>= 90% engine coverage).

**B2: `createInitialState` located in `engine.ts` instead of `constants.ts`**
- S02 AC4 specifies it should be in `src/engine/constants.ts`.
- Currently in `src/engine/engine.ts`.
- **Impact:** Minor -- function is still exported and accessible. This is a spec deviation, not a functional issue. Recommend reconciling the spec rather than moving the function, since it depends on types and the engine module is the natural home.

### SUGGESTION

**SG1: Cell size clamp range deviates from spec**
- Spec section 6 defines `--cell-size: clamp(28px, 8vw, 48px)`.
- Implementation uses `clamp(32px, 7vw, 56px)` (desktop) and `clamp(28px, 9vw, 44px)` (mobile).
- The max of 56px exceeds the 48px spec. On large screens cells will be bigger than designed. Consider aligning to the spec value or explicitly updating the spec.

**SG2: `SubBoard` calls `getValidBoards()` on every render**
- Each of the 9 SubBoard components calls `s.getValidBoards()` in its selector, which creates a new array each time, potentially causing unnecessary re-renders.
- Consider memoizing the valid boards array in the store or using `shallow` comparison in the Zustand selector.

**SG3: Mark animation duration is 200ms instead of spec's 150ms**
- The `markAppear` keyframe uses 200ms. Spec section 6 says ~150ms. Minor visual difference. Consider aligning.

**SG4: Engine `makeMove` silently returns same state on invalid move**
- While this prevents crashes, it makes debugging harder during development. Consider throwing in development mode or logging a warning.

**SG5: `Cell` component uses store selectors for individual cell data**
- Each Cell does 4 separate `useGameStore` calls. With 81 cells, this is 324 selector subscriptions. While Zustand is efficient, consider batching: have SubBoard select the full board array and pass cell values via props (as the plan suggested in section 4).

### NIT

**N1: `WINNING_LINES` renamed to `WIN_PATTERNS`**
- Spec says `WINNING_LINES`, implementation uses `WIN_PATTERNS`. Both are clear. Just a naming inconsistency with the spec.

**N2: Missing `BOARD_SIZE` in spec**
- `constants.ts` exports `BOARD_SIZE = 9` which is not in the spec. Useful constant, good addition.

**N3: `POSITION_LABELS` not in spec**
- Added for accessibility. Good addition not called out in the plan.

**N4: `getValidMoves` and `getWinningLine` not in spec**
- Additional engine functions beyond the spec. `getValidMoves` is useful for potential AI work; `getWinningLine` drives the winning line overlay in MetaBoard. Both are good additions.

**N5: `SubBoardStatus` is a discriminated union instead of a simple string**
- Spec defined `BoardResult = Player | 'draw' | null`. Implementation uses `{ result: 'playing' } | { result: 'won'; winner: Player } | { result: 'draw' }`. This is more type-safe -- an improvement over the spec.

---

## 6. Spec Reconciliation

The implementation deviates from the spec in naming and some structural choices. These are all improvements or neutral changes. The following reconciliation documents the delta:

| Spec Name | Implementation Name | Verdict |
|-----------|-------------------|---------|
| `CellState` | `CellValue` | Accept impl -- clearer name |
| `BoardResult` | `SubBoardStatus` (discriminated union) | Accept impl -- more type-safe |
| `Move` (interface) | Inline `{ subBoard, cell }` | Accept impl -- no standalone type needed |
| `GameState.boards` | `GameState.board` | Accept impl -- singular is conventional for a single data structure |
| `GameState.boardResults` | `GameState.subBoardStatus` | Accept impl -- matches SubBoardStatus type |
| `GameState.activeBoard` | `GameState.activeSubBoard` | Accept impl -- more specific |
| `GameState.winner` | `GameState.gameOutcome` | Accept impl -- richer type (win vs draw distinction) |
| `GameState.moveCount` | Not in spec | Accept impl -- useful derived field |
| `WINNING_LINES` | `WIN_PATTERNS` | Accept impl |
| `createInitialState` in constants.ts | In engine.ts | Accept impl -- engine.ts is more logical home |
| `undoMove` engine function | Store-only replay | Accept impl -- per ADR-4, store is the right place |

**Recommendation:** Update spec section 3.6 (Data Model Sketch) and section 3 (Game Engine API) to match the implementation names. The implementation names are uniformly better.

---

## 7. Recommendations

1. **Install `@vitest/coverage-v8`** and verify >= 90% engine coverage. This is the only potentially unmet success metric.
2. **Consider memoizing `getValidBoards`** result to reduce re-render overhead (SG2/SG5).
3. **Update the spec** to reflect the implementation's naming and structural improvements (section 6 above).
4. Align cell size clamp values to spec or update spec to match implementation intent (SG1).

---

## 8. Verdict

**PASS with conditions.** The implementation meets all functional requirements across all 10 stories. The game engine is correct, the UI is polished and accessible, and the architecture is clean. The one blocking issue (B1) is a tooling gap (missing coverage dependency) that does not affect functionality. B2 is a spec location mismatch that is best resolved by updating the spec.

Gate recommendation: **Approve** once B1 is resolved (coverage dependency installed and >= 90% engine coverage confirmed).
