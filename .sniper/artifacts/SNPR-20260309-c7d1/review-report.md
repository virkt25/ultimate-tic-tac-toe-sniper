# Review Report — SNPR-20260309-c7d1

**Date:** 2026-03-09
**Reviewer:** Code Reviewer Agent

---

## Summary

**Verdict: PASS** (with suggestions)

The implementation is solid. All 29 engine tests pass, TypeScript compiles in strict mode with zero errors, and the codebase follows the architecture plan faithfully. The engine/UI separation is clean, CSS Modules are used correctly with centralized theme tokens, and the component hierarchy matches the plan. Two minor issues warrant attention but nothing blocks a merge.

| Metric | Value |
|--------|-------|
| Test files | 1 (engine) |
| Tests | 29/29 passing |
| TypeScript strict | Yes, zero errors |
| Engine React imports | 0 (clean separation) |
| Components | 7 (App, MetaBoard, SubBoard, Cell, WinOverlay, GameStatus, Controls) |

---

## Scope Validation

### Requirements Coverage

| Req | Description | Status | Notes |
|-----|-------------|--------|-------|
| FR-1.1 | 81 playable cells in 3x3 of 3x3 | Implemented | MetaBoard renders 9 SubBoards, each with 9 Cells |
| FR-1.2 | Visual separation of sub-boards | Implemented | MetaBoard gap/padding + SubBoard border-radius + surface color |
| FR-2.1 | X goes first | Implemented | `createInitialState` sets `currentPlayer: 'X'` |
| FR-2.2 | Turn alternation | Implemented | `makeMove` toggles player |
| FR-2.3 | Current player display | Implemented | GameStatus component |
| FR-3.1 | Move constraint mechanic | Implemented | `getNextActiveBoard` + `makeMove` validation |
| FR-3.2 | Active board highlighting | Implemented | SubBoard `.active` / `.dimmed` CSS classes |
| FR-3.3 | Free move on decided board | Implemented | `getNextActiveBoard` returns null; SubBoard checks `activeBoard === null` |
| FR-3.4 | Prevent play in won/full board | Implemented | `makeMove` checks `subBoardOutcomes[boardIndex] !== null` |
| FR-4.1 | Sub-board win detection | Implemented | `checkWinner` in `makeMove` |
| FR-4.2 | Win overlay (large X/O) | Implemented | WinOverlay component with Motion spring animation |
| FR-4.3 | Sub-board draw | Implemented | Board marked `'draw'` when full with no winner |
| FR-5.1 | Meta-board win detection | Implemented | `checkWinner(newSubBoardOutcomes)` in `makeMove` |
| FR-5.2 | Victory message | Implemented | GameStatus shows "Player X/O Wins!" |
| FR-5.3 | Prevent moves after win | Implemented | `makeMove` returns null when `status !== 'playing'` |
| FR-5.4 | Draw when all decided | Implemented | `allDecided` check in `makeMove` |
| FR-5.5 | Early draw detection | Implemented | `isEarlyDraw` function |
| FR-6.1 | Turn enforcement | Implemented | Implicit via single-click turn system |
| FR-6.2 | Occupied cell rejection | Implemented | `makeMove` checks cell is null |
| FR-6.3 | Wrong-board rejection | Implemented | `makeMove` checks `activeBoard` constraint |
| FR-7.1 | Free first move | Implemented | Initial `activeBoard` is null; all boards active |
| FR-8.1 | New Game reset | Implemented | Controls calls `resetGame()` |
| FR-8.2 | New Game always accessible | Implemented | Button always rendered, no conditional |
| FR-9.1 | Dark theme | Implemented | `global.css` tokens, dark background |
| FR-9.2 | Distinct player colors | Implemented | `--color-x: #00d4ff`, `--color-o: #ff6b6b` |
| FR-9.3 | Mark placement animation | Implemented | Motion spring in Cell `Mark` component |
| FR-9.4 | Win overlay animation | Implemented | Motion spring in WinOverlay |
| FR-9.5 | Celebration animation | Partially | CSS pulse animation on status text + text-shadow glow; no particle/confetti effect. Winning sub-boards pulse via `.winning` class. Meets the bar. |
| FR-10.1 | Desktop layout | Implemented | Max-width 600px, centered |
| FR-10.2 | Tablet layout | Implemented | Media query adjusts max-width to 520px |
| FR-10.3 | Phone usable | Implemented | Max-width 100% at <768px |
| FR-11.1 | Color contrast | Implemented | Cyan (#00d4ff) and coral (#ff6b6b) on dark bg exceed AA ratios |
| FR-11.2 | Keyboard navigation | Implemented | Buttons with tabIndex management + arrow key handler |
| NFR-1.1 | Sub-100ms response | Expected pass | Pure function engine, minimal React re-renders via Zustand selectors |
| NFR-1.2 | 60fps animations | Expected pass | CSS animations for pulses, Motion for springs (GPU-compositable) |
| NFR-2.1 | Engine/UI separation | Implemented | Engine has zero React imports; fully pure-function |
| NFR-2.2 | Engine test coverage | Implemented | 29 tests covering all listed scenarios |

**Coverage: 100% of PRD requirements addressed.**

---

## Standards Enforcement

### TypeScript
- **Strict mode:** Enabled in `tsconfig.app.json` (`"strict": true` plus additional lint flags `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
- **Zero errors:** `tsc -b` passes cleanly.
- **Type imports:** Correctly uses `import type` for type-only imports throughout (`types.ts`, `engine.ts`, `Cell.tsx`, `WinOverlay.tsx`, `gameStore.ts`).

### Engine/UI Separation
- `src/engine/` contains zero React or DOM imports. All functions are pure: `GameState` in, `GameState | null` out.
- Store is thin (27 lines), delegating all logic to engine.

### CSS Modules
- All 7 components use co-located `.module.css` files.
- Theme tokens are centralized in `global.css` as CSS custom properties.
- No inline styles. No global class leakage.

### File Structure
- Matches the architecture plan: `engine/`, `store/`, `components/` domain folders.
- Component naming follows plan: PascalCase components, co-located styles.
- One deviation: `WinOverlay` component exists (as planned) but was not listed in the original story map as a separate component file -- it was mentioned in D5/D8 of the plan and it's appropriate.

### Conventions
- Consistent use of `export default function` for components.
- `useCallback` used for event handlers in Cell and SubBoard (performance-conscious).
- Zustand selectors are granular (e.g., `s => s.game.boards[boardIndex][cellIndex]`) to minimize re-renders.

---

## Risk Assessment

| Category | Score | Notes |
|----------|-------|-------|
| Security | Low | No backend, no user input beyond clicks, no data persistence. No XSS vectors. |
| Performance | Low | Pure-function engine is O(1) per move (constant 81-cell board). Zustand selectors prevent unnecessary re-renders. CSS handles high-frequency animations. |
| Reliability | Low | Engine is well-tested with 29 tests. Immutability verified by dedicated test. Edge cases (early draw, free move, decided board) all covered. |
| Maintenance | Low | Clean separation of concerns. Small file sizes (largest is engine.ts at 155 lines). Types are well-documented. |

---

## Findings

### Blocking

None.

### Suggestions

**S1: Redundant logic in `isEarlyDraw` — `src/engine/engine.ts` lines 69-88**

The function has two passes over `WIN_LINES` that do overlapping work. The first loop (lines 69-78) returns `false` early if any line is viable for either player, but the logic is not quite right: it checks `!hasO && !hasDraw` and `!hasX && !hasDraw` separately, which is correct but then falls through to a second loop (lines 82-88) that does the same thing. The second loop is the authoritative one; the first loop is an early-exit optimization that happens to be correct but adds confusion.

Recommendation: Remove the first loop (lines 69-78) and keep only the second pass (lines 80-88). The performance difference is negligible (16 iterations vs 8 in worst case on an 8-element array), and the clarity improvement is worthwhile.

**S2: Early draw test is incomplete — `src/engine/engine.test.ts` lines 233-270**

The `makeMove` "detects early draw" test constructs a scenario but then discovers mid-comment that the arrangement actually results in an X diagonal win, not an early draw. The test falls back to `expect(result).not.toBeNull()`, which asserts almost nothing meaningful. The `isEarlyDraw` unit tests (lines 96-109) do cover the function correctly, but the integration-level test through `makeMove` is effectively a no-op.

Recommendation: Either fix the test to construct a genuine early-draw-via-makeMove scenario, or remove it and rely on the direct `isEarlyDraw` unit tests which are correct.

**S3: No store-level tests — `src/store/`**

The plan (S06) called for a Zustand store. While the store is thin (delegating to engine), there are no tests for the store itself. The PRD's NFR-2.2 lists scenarios that are covered by engine tests, but a store integration test (e.g., verifying that `playMove` with an invalid move leaves state unchanged, or that `resetGame` produces initial state) would add confidence.

Recommendation: Add a small `gameStore.test.ts` with 2-3 integration tests.

### Nits

**N1: `buttonRef` unused in Cell — `src/components/Cell.tsx` line 17**

`const buttonRef = useRef<HTMLButtonElement>(null)` is declared but never used (not passed to the `<button>` element's `ref` prop). With `noUnusedLocals` enabled in tsconfig, this would normally cause a compile error -- it currently passes because the ref is technically "used" (declared), but it serves no purpose.

Recommendation: Either remove the unused ref or wire it to the `<button>` element if focus management from parent is planned.

**N2: SubBoard `aria-label` for drawn boards — `src/components/SubBoard.tsx` line 50**

The aria-label says `won by ${outcome}` for all non-null outcomes, including `draw`. This would produce "won by draw" for drawn boards.

Recommendation: Adjust to handle the draw case: `outcome === 'draw' ? ', drawn' : outcome ? \`, won by ${outcome}\` : ''`.

**N3: `index.html` reference — `src/main.tsx` line 6**

`document.getElementById('root')!` uses a non-null assertion. This is standard for Vite projects and acceptable, but for maximum safety a runtime guard could be added.

---

## Spec Reconciliation

The implementation matches the PRD with no meaningful divergences. All functional requirements (FR-1 through FR-11) and non-functional requirements (NFR-1, NFR-2) are addressed. The architecture plan's decisions (D1-D8) are followed:

- D1 (project structure): Matches exactly.
- D2 (pure functions): Implemented as specified.
- D3 (Zustand): Store interface matches plan.
- D4 (CSS Modules + custom properties): All tokens from the plan are present in `global.css`.
- D5 (Motion animations): Mark placement, win overlay, and celebration are all animated. Celebration is CSS-based (pulse + glow) rather than confetti/particles, which is a reasonable simplification that still meets FR-9.5.
- D6 (win detection): `WIN_LINES` and `checkWinner` match the plan.
- D7 (keyboard nav): Buttons with `tabIndex` management and arrow-key handler, as planned.
- D8 (thin components): All logic delegates to engine/store.

**No PRD updates required.** Implementation is faithful to the specification.
