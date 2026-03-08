# Code Review Report: SNPR-20260307-c1a9

**Date:** 2026-03-07
**Reviewer:** Code Reviewer Agent
**Branch:** `sniper-3.2.0`
**Tests:** 72 passing (5 test files), 0 failures

---

## Executive Summary

The implementation delivers a fully functional Ultimate Tic-Tac-Toe game that satisfies the core gameplay requirements from the spec. Game logic is correct, well-tested, and the UI is polished. However, there are notable architectural deviations from the plan and several CSS bugs where referenced classes are never defined.

---

## Dimension 1: Scope Validation

### Requirements Coverage

| Spec Requirement | Status | Notes |
|-----------------|--------|-------|
| Turn order (X first, alternating) | Implemented | `engine.ts:134` |
| First move anywhere | Implemented | `activeSubBoard: null` initial state |
| Send rule (cell -> board) | Implemented | `engine.ts:125` |
| Winning a small board | Implemented | `checkSubBoardWin()` |
| Winning the game (meta-grid) | Implemented | `checkMetaBoardWin()` |
| Draw detection | Implemented | `engine.ts:118-120` |
| Sent to won/full board -> free move | Implemented | `engine.ts:127-129` |
| Tied board counts for neither player | Implemented | `checkMetaBoardWin` maps draws to null |
| Active board highlighting | Implemented | `SubBoard.module.css` `.active` class |
| Free move highlights all undecided boards | Implemented | `isFreeMove` prop + `isActive` logic |
| Turn indicator | Implemented | `GameStatus.tsx` |
| Won board overlay (large X/O) | Implemented | `SubBoard.tsx:76-92` SVG overlays |
| Drawn board visualization | Implemented | `SubBoard.tsx:94-98` with grey overlay |
| New Game button | Implemented | `Controls.tsx` |
| Responsive layout | Implemented | Media queries in all CSS modules |
| Colorblind accessibility (shapes not just color) | Implemented | SVG X (lines) and O (circle) shapes in overlays |
| localStorage persistence | Implemented | Zustand `persist` middleware, key `uttt-game` |
| Corrupt localStorage fallback | Partially implemented | Zustand persist handles JSON parse errors, but no explicit validation of state shape |
| Mark placement animation | Implemented | `Cell.module.css` `popIn` keyframe |
| Hover preview on valid cells | Implemented | `Cell.tsx:69-70` hover hint element |
| Invalid click feedback (shake) | Implemented | `Cell.tsx:40-47`, `Cell.module.css` shake animation |
| Game outcome display | Implemented | `GameStatus.tsx` with winner/draw messaging |
| Emphasized New Game on game over | Referenced but CSS missing | See finding B-1 |

### Acceptance Criteria Gaps

None of the acceptance criteria are fundamentally unmet. All 8 stories' core functionality is present.

---

## Dimension 2: Standards Enforcement

### Architectural Deviations from Plan

**D-1: Duplicate game logic implementations** `suggestion`

There are TWO complete, independent game logic implementations:

1. **`src/game/`** — The implementation designed in `plan.md`: types (`Player`, `CellValue`, `BoardResult`, `GameState`, `GameAction`), pure functions (`validateMove`, `checkBoardResult`, `checkGameResult`, `getNextActiveBoard`), a `gameReducer`, and `createInitialState`. Has 42 passing tests.

2. **`src/engine/`** — The implementation actually used by components: different types (`SubBoardStatus` discriminated union, `SubBoardIndex`/`CellIndex` literal types, `gameOutcome` object instead of `winner`/`isDraw` booleans), different function names (`makeMove`, `isValidMove`, `checkSubBoardWin`), additional features (`getValidMoves`, `findWinningPattern`, `lastMove`, `moveCount`). Has 25 passing tests.

The `src/game/` module is **dead code** -- nothing imports from it except its own tests. Both implementations are logically correct and well-tested, but maintaining two parallel implementations is a maintenance burden.

- `src/game/types.ts`, `src/game/logic.ts`, `src/game/reducer.ts`, `src/game/constants.ts` -- unused by app
- `src/engine/types.ts`, `src/engine/engine.ts`, `src/engine/constants.ts` -- used by app

**D-2: Zustand store instead of useReducer** `suggestion`

The plan specified `useReducer` (Decision #2) for state management. The implementation uses Zustand with `persist` middleware instead. This is a reasonable trade: Zustand's `persist` middleware provides localStorage sync "for free," eliminating the need for a custom `useLocalStorage` hook. The `src/hooks/` directory contains only a `.gitkeep` placeholder.

This deviation actually simplifies the architecture (no prop drilling of dispatch, no custom hook), but it contradicts the spec's statement that "no external state library should be needed" and the plan's Decision #2.

**D-3: CSS Modules instead of Tailwind CSS** `suggestion`

The spec decided on Tailwind CSS (Section 4, Decisions table). The implementation uses CSS Modules with hand-written CSS. Tailwind is installed as a dependency (`tailwindcss: ^4.2.1`, `@tailwindcss/postcss`, `tailwind.config.js` exists) but is not used anywhere -- no utility classes appear in any component. Story 8 acceptance criteria specifically mention "responsive Tailwind utilities" and "Tailwind's design system," neither of which are used.

The CSS Modules approach is well-executed with consistent design tokens via CSS custom properties in `src/global.css`, but the Tailwind dependency is dead weight.

**D-4: Component naming deviations** `nit`

| Plan Name | Actual Name | Notes |
|-----------|-------------|-------|
| `GameHeader` | `GameStatus` | Functionally equivalent |
| `GameControls` | `Controls` | Functionally equivalent |
| `SmallBoard` | `SubBoard` | Functionally equivalent |
| `App` at `src/App.tsx` | `App` at `src/components/App.tsx` | Moved into components dir |

### TypeScript Quality

- **Strong typing in engine layer:** `SubBoardIndex` and `CellIndex` use literal union types (`0 | 1 | 2 | ... | 8`) providing compile-time bounds checking. This is better than the plan's generic `number` approach.
- **Discriminated union for SubBoardStatus:** `{ result: 'playing' } | { result: 'won'; winner: Player } | { result: 'draw' }` is type-safer than `BoardResult = Player | 'draw' | null`.
- **No `any` usage** anywhere in the codebase.
- **Proper readonly annotations** on `WIN_PATTERNS` constant.

### Test Coverage

- **72 tests passing** across 5 files.
- Engine tests (25) cover: initial state, basic moves, send rule, free move on won/drawn boards, sub-board wins (rows/columns/diagonals), meta-board wins, invalid moves (occupied cell, wrong board, decided board, game over), sub-board draws, edge cases (simultaneous sub+meta win, self-referencing send), valid move enumeration, full game sequences.
- Game logic tests (24) cover the same scenarios for the unused `src/game/` implementation.
- Store tests (4) cover: initial state, play dispatching, reset, invalid move rejection.
- Missing: no component/rendering tests beyond the placeholder `App.test.tsx` (1 test).

### Naming Consistency

- Consistent use of camelCase for functions and variables.
- Consistent PascalCase for component names and types.
- CSS classes use camelCase (CSS Modules convention).
- File naming is consistent: `PascalCase.tsx` for components, `camelCase.ts` for logic.

---

## Dimension 3: Risk Scoring

### Security: Low Risk

- No user input beyond cell clicks (constrained to SubBoardIndex/CellIndex).
- No backend communication, no authentication.
- localStorage stores only game state (no sensitive data).
- External font loaded via Google Fonts CDN (`src/global.css:1`) -- minor supply-chain consideration but standard practice.

### Performance: Low Risk

- Game state is small (81 cells + 9 statuses + metadata). All operations are O(1) or O(81) worst case.
- `getValidMoves` iterates all 81 cells but is not called during rendering (only exported for programmatic use).
- `isSubBoardActive` and `checkValidMove` are recomputed per render in MetaBoard but these are trivially cheap.
- No unbounded operations or N+1 patterns.
- `useCallback` used appropriately for keyboard navigation handler.

### Reliability: Low-Medium Risk

**B-1: Missing CSS class definitions** `blocking`

Three CSS classes are referenced in components but never defined in their CSS modules:

| Component | Class Referenced | CSS Module | Defined? |
|-----------|-----------------|------------|----------|
| `SubBoard.tsx:39` | `styles.muted` | `SubBoard.module.css` | No |
| `SubBoard.tsx:40` | `styles.drawBoard` | `SubBoard.module.css` | No |
| `Controls.tsx:11` | `styles.emphasized` | `Controls.module.css` | No |

With CSS Modules, referencing an undefined class yields `undefined`, which gets filtered out by the `.filter(Boolean)` pattern. This means:
- **Muted sub-boards** (not active, not resolved) have no visual distinction from active boards. This degrades the UX -- players cannot easily see which board is active vs. inactive.
- **Drawn boards** get the `.draw` overlay but no `.drawBoard` styling on the container (the overlay itself works, so impact is minor).
- **Emphasized New Game button** on game over has no visual emphasis. Story 6 AC: "the system shall visually emphasize the New Game button to prompt replay" is unmet.

**B-2: No validation of localStorage state shape** `suggestion`

`gameStore.ts` uses Zustand's `persist` middleware which handles JSON parse errors. However, if the stored state has a valid JSON shape but wrong structure (e.g., from a schema change between versions), the app would hydrate with a malformed state. Consider adding a version field or shape validation.

### Maintenance: Medium Risk

**M-1: Dead code in src/game/** `suggestion`

The entire `src/game/` directory (6 files, ~400 lines including tests) is dead code. It represents the plan's designed architecture but is superseded by `src/engine/` + `src/store/`. This creates confusion for future developers about which is the "real" implementation. Should be removed or consolidated.

**M-2: GameState reconstruction boilerplate** `suggestion`

In `gameStore.ts` (lines 19-27) and `App.tsx` (lines 11-19), the `GameState` object is manually reconstructed from the Zustand store by listing every field. This is fragile -- if a field is added to `GameState`, both locations must be updated. Consider extracting a helper or using a selector pattern.

**M-3: Inline IIFE in MetaBoard JSX** `nit`

`MetaBoard.tsx:146-161` uses an immediately-invoked function expression inside JSX to compute the winning line SVG. This could be extracted to a small component or computed before the return.

---

## Findings Summary

| ID | Severity | Finding | File(s) |
|----|----------|---------|---------|
| B-1 | `blocking` | Missing CSS classes: `.muted`, `.drawBoard`, `.emphasized` -- no visual distinction for muted boards, no game-over button emphasis | `SubBoard.module.css`, `Controls.module.css` |
| D-1 | `suggestion` | Duplicate game logic: `src/game/` is dead code, `src/engine/` is the real implementation | `src/game/*`, `src/engine/*` |
| D-2 | `suggestion` | Zustand replaces useReducer (deviation from plan Decision #2) | `src/store/gameStore.ts` |
| D-3 | `suggestion` | CSS Modules replaces Tailwind CSS (deviation from spec Decision table) | All `*.module.css` files |
| B-2 | `suggestion` | No localStorage state shape validation for schema migrations | `src/store/gameStore.ts` |
| M-1 | `suggestion` | Dead code in `src/game/` (~400 lines) should be removed | `src/game/*` |
| M-2 | `suggestion` | Fragile GameState reconstruction boilerplate in 2 locations | `src/store/gameStore.ts:19-27`, `src/components/App.tsx:11-19` |
| D-4 | `nit` | Component naming differs from plan (GameStatus vs GameHeader, etc.) | Various |
| M-3 | `nit` | Inline IIFE in MetaBoard JSX | `src/components/MetaBoard.tsx:146-161` |

---

## Verdict

**Conditional pass.** The game logic is correct and thoroughly tested. The UI is well-structured and polished. The blocking finding (B-1: missing CSS classes) must be fixed as it degrades the core UX of distinguishing active vs. inactive boards and the game-over state emphasis. The architectural deviations (Zustand, CSS Modules, dual implementations) should be documented as intentional decisions and the dead code cleaned up, but they do not block shipping.
