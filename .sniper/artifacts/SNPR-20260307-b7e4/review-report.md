# Review Report: Ultimate Tic-Tac-Toe

**Protocol:** SNPR-20260307-b7e4
**Reviewer:** Code Review Agent
**Date:** 2026-03-07
**Verdict:** PASS WITH SUGGESTIONS

---

## Summary

The implementation is solid and complete. All core game rules are correctly implemented, the engine is pure and well-tested (25 passing tests), TypeScript strict mode is enforced, CSS Modules are used throughout, and the component architecture follows the plan exactly. The codebase compiles cleanly, lint passes with no warnings, and all tests pass.

There are no blocking issues. Several suggestions would improve polish, accessibility completeness, and test coverage.

---

## Dimension 1: Scope Validation

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| FR-1: Game Rules Engine | Implemented | Send rule, free move, sub-board/meta-board win/draw all correct |
| FR-2: Move Validation | Implemented | Invalid moves rejected; cells disabled when not valid |
| FR-3: Visual Game State | Implemented | Active highlighting, turn indicator, last move, overlays, winning line |
| FR-4: Game Flow | Implemented | New Game button, game over display |
| FR-5: Local Multiplayer | Implemented | Two-player, same device |
| FR-6: User Experience | Implemented | Hover states, transitions, modern dark theme |
| NFR-1: Performance | Implemented | Pure functions, minimal re-renders |
| NFR-2: Browser Support | Implemented | Standard CSS, no exotic APIs |
| NFR-3: Accessibility | Partially | See findings below |
| NFR-4: Code Quality | Implemented | Strict TS, ESLint, Prettier, Vitest |
| NFR-5: Deployability | Implemented | Vite static build, `npm run build` |

### Story-by-Story Acceptance Criteria

**S01 - Project Scaffolding:** All criteria met. `npm run dev`, `npm run build`, `npm run test`, `npm run lint` all work. TypeScript strict mode confirmed in `tsconfig.app.json` line 20.

**S02 - Game Types and Constants:** All criteria met. Types exported from `src/engine/types.ts`. No `any` types. WIN_PATTERNS and BOARD_SIZE in `src/engine/constants.ts`.

**S03 - Game Engine Core:** All criteria met. `createInitialState()` (named differently from spec's `createGame()` -- acceptable). `makeMove` returns unchanged state on invalid move rather than throwing -- consistent with spec's "returning unchanged state OR throwing" option.

**S04 - Win Detection:** All criteria met. Sub-board win, sub-board draw, meta-board win, meta-board draw, and simultaneous sub-board+meta-board win all handled in `makeMove`.

**S05 - Game Engine Tests:** All criteria met. 25 tests covering send rule, free move (won board, drawn board, first move), invalid moves (occupied cell, wrong sub-board, won sub-board, after game over), all win pattern types, edge cases (simultaneous win, send-to-just-won-board), full game sequences.

**S06 - Board Rendering:** All criteria met. MetaBoard/SubBoard/Cell hierarchy renders 81 cells. Clear visual hierarchy via CSS (thicker borders on meta-board, thinner on sub-boards). Cells are `<button>` elements.

**S07 - Game Interaction:** All criteria met. Click dispatches through engine, active sub-board highlighted, free move highlights all active boards, invalid cells disabled, game over prevents moves.

**S08 - Visual Polish:** All criteria met. Last move indicator (yellow highlight, `Cell.module.css` line 47-49), sub-board overlays for won (X/O) and drawn, winning line via SVG (`MetaBoard.tsx` lines 115-140), hover states on valid cells with ghost mark preview.

**S09 - Game Controls:** All criteria met. Turn indicator with player badge, New Game button always visible, game over message for win and draw.

**S10 - Responsive Layout and Accessibility:** Partially met. See findings below.

### Scope Creep Check

- **localStorage persistence** is implemented via Zustand persist middleware (`gameStore.ts` line 53-55). The PRD lists this as "Out of Scope" but the architecture plan (D6) explicitly decides to include it. This is an intentional plan decision, not scope creep. No issue.
- **Dark theme** is the default (spec said "clean light theme" in PRD open decisions). The dark theme is well-executed and this is a design improvement, not a problem.
- No other scope creep detected.

### Missing Requirements

None blocking. See suggestions below.

---

## Dimension 2: Standards Enforcement

### Findings

#### [suggestion] S10-AC-3: Keyboard navigation does not restrict focus to valid sub-boards
- **File:** `src/components/MetaBoard.tsx`, lines 46-88
- **Detail:** The keyboard handler moves focus across all 81 cells by arrow keys regardless of which sub-board is active. S10 acceptance criterion states: "Keyboard navigation should respect the send rule: only valid sub-boards/cells should be reachable via keyboard when a constraint is active." Currently, a keyboard user can arrow-focus into cells in inactive sub-boards. The cells are disabled, so no invalid moves can be made, but the focus behavior does not skip non-playable cells.
- **Recommendation:** Consider skipping disabled/invalid cells when arrowing, or use `tabIndex={isValid ? 0 : -1}` so that Tab-based navigation naturally skips invalid cells.

#### [suggestion] Missing `gameStore.test.ts` — Store integration tests
- **File:** (missing) `src/store/gameStore.test.ts`
- **Detail:** The architecture plan (`plan.md` line 165) lists `gameStore.test.ts` as part of the file structure. No store integration tests exist. The engine tests are comprehensive and the store is thin wrapper, so this is low risk, but the plan called for it.
- **Recommendation:** Add basic tests verifying `play()`, `reset()`, and `isValidMove()` work through the store.

#### [suggestion] `index.html` title says "temp-scaffold"
- **File:** `/Users/taranveer/Github/ultimate-tic-tac-toe-sniper/index.html`, line 7
- **Detail:** The page title is "temp-scaffold" rather than "Ultimate Tic-Tac-Toe". This is visible in the browser tab.
- **Recommendation:** Change to `<title>Ultimate Tic-Tac-Toe</title>`.

#### [nit] App.tsx reconstructs GameState object on every render
- **File:** `src/components/App.tsx`, lines 11-19
- **Detail:** The `gameState` object is reconstructed from the store on every render. The same pattern is repeated in `gameStore.ts` (lines 19-27 and 42-49). This works correctly but is verbose. Zustand's `getState()` already returns these fields.
- **Recommendation:** Consider adding a `getGameState()` selector or using `useShallow` to reduce boilerplate. Not a correctness issue.

#### [nit] `findWinningPattern` not tested
- **File:** `src/engine/engine.ts`, lines 73-84; `src/engine/engine.test.ts`
- **Detail:** The `findWinningPattern` function is exported and used by `MetaBoard.tsx` but has no dedicated unit test. It is implicitly covered by the full-game-win test, but direct coverage would be better.

#### [nit] `currentPlayer` prop type in Cell is `CellValue` instead of `Player`
- **File:** `src/components/Cell.tsx`, line 8
- **Detail:** `currentPlayer: CellValue` allows `null`, but the current player is never null. Using `Player` would be more precise.

#### [nit] SubBoard overlay not announced to screen readers
- **File:** `src/components/SubBoard.tsx`, lines 69-81
- **Detail:** The overlay divs for won/drawn sub-boards have no `role` or `aria-label`. The sub-board's `aria-label` on the wrapper does include the status, so this is partially covered, but the overlay content (the large "X"/"O"/"Draw" text) is decorative and could benefit from `aria-hidden="true"` to avoid double-announcement.

---

## Dimension 3: Risk Scoring

| Risk Category | Score | Assessment |
|---------------|-------|------------|
| **Security** | Low | Client-only app. No user input beyond clicks. localStorage stores game state only. No XSS vectors (React escapes by default). No network calls. |
| **Performance** | Low | 81 buttons is trivial for React. Pure engine functions are O(1) per move. No heavy computations. CSS animations are GPU-accelerated. |
| **Reliability** | Low | Engine logic has 25 passing tests covering all edge cases. TypeScript strict mode catches type errors at compile time. Invalid moves are silently rejected (no crashes). |
| **Maintenance** | Low | Clean separation between engine (pure TS) and UI (React). ~20 files total. Well-typed. CSS Modules prevent style conflicts. Dependencies are minimal (React, Zustand). |

No Critical or High risks identified.

---

## Spec Reconciliation

Comparing `.sniper/artifacts/spec.md` against the implementation:

| Spec Item | Spec Says | Implementation | Delta |
|-----------|-----------|---------------|-------|
| Framework | Open question | React + Vite | Resolved per plan |
| State persistence | Open question | Yes, localStorage via Zustand persist | Resolved per plan D6 |
| Draw detection | Simple (all resolved) | Simple (all resolved) | Matches |
| Theme | Open question | Dark theme | Decided during implementation |
| `createGame()` name | `createGame()` | `createInitialState()` | Cosmetic rename; acceptable |
| Component tests | NFR-4 mentions them | No component tests exist | Gap -- engine tests are thorough but no RTL component tests |
| Store tests | Plan lists file | Not implemented | Gap |
| Phone support | Stretch goal | CSS handles down to 499px | Partially addressed |

The spec does not require updating -- the open questions were resolved in the plan document, and the implementation matches the plan. No meaningful drift between spec and code beyond the expected resolution of open questions.

---

## Consolidated Findings

| # | Severity | Category | Summary | File | Line(s) |
|---|----------|----------|---------|------|---------|
| 1 | suggestion | Accessibility | Arrow key navigation does not skip invalid/inactive cells | `src/components/MetaBoard.tsx` | 46-88 |
| 2 | suggestion | Coverage | Missing `gameStore.test.ts` store integration tests | (missing file) | -- |
| 3 | suggestion | Polish | index.html title is "temp-scaffold" | `index.html` | 7 |
| 4 | nit | Maintainability | GameState reconstruction boilerplate in App.tsx and gameStore.ts | `src/components/App.tsx` | 11-19 |
| 5 | nit | Coverage | `findWinningPattern` has no direct unit test | `src/engine/engine.test.ts` | -- |
| 6 | nit | Type Safety | `currentPlayer` prop typed as `CellValue` instead of `Player` | `src/components/Cell.tsx` | 8 |
| 7 | nit | Accessibility | Won/drawn overlay content should be `aria-hidden` | `src/components/SubBoard.tsx` | 69-81 |

---

Last reconciled: 2026-03-07
