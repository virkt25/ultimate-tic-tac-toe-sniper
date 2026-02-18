# Story S11: Implement Cell component with click handling

> **Epic:** E04-board-rendering
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S08

## Description

Create Cell.tsx — renders an individual cell that displays X, O, or empty state and handles click/tap to call placeMove on the Zustand store. The component is memoized with React.memo to prevent unnecessary re-renders when unrelated cells change.

## Embedded Context

### From PRD

- **FR-040:** Handle both click (desktop) and tap (mobile) input on cells.
- **FR-041:** Ignore clicks on invalid targets (filled cells, inactive boards, game-over state).
- **US-002:** As a player, I want to place marks on the correct board so my moves register where intended.
- **NFR:** Input response time must be less than 50ms from click/tap to visual update.

### From Architecture

- **Cell.tsx** — Props: `{ boardIndex: BoardIndex, cellIndex: CellIndex }`. Reads cell value and active state from the Zustand game store using selectors. Wrapped in `React.memo`.
- Cell click handler calls `gameStore.placeMove(boardIndex, cellIndex)`.
- The store's `placeMove` action silently ignores invalid moves (filled cells, inactive boards, game over) — the Cell does not need to validate moves itself.

### From UX Spec

- **Cell states:**
  - **empty:** Clickable if the parent sub-board is active. Shows pointer cursor.
  - **filledX:** Displays X mark in blue (`#2563EB`). Not clickable.
  - **filledO:** Displays O mark in red (`#DC2626`). Not clickable.
  - **disabled:** Empty but parent sub-board is inactive. No pointer cursor, no hover effect.
- **Cell props (logical):** value (`'X' | 'O' | null`), isActive (`boolean`), onClick handler.
- **Cell mark sizing:** Marks fill 60-70% of the cell area for clear visibility without crowding.

## Acceptance Criteria

1. **Given** an empty cell in the active board, **When** clicked, **Then** `placeMove` is called with the correct `boardIndex` and `cellIndex`.
2. **Given** a filled cell, **When** rendered, **Then** it displays the correct mark (X in blue or O in red).
3. **Given** an empty cell in an inactive board, **When** clicked, **Then** nothing happens (no `placeMove` call).
4. **Given** a Cell wrapped in React.memo, **When** an unrelated cell's state changes, **Then** this Cell does not re-render.
5. **Given** a cell, **When** a mark is placed, **Then** the visual update happens in under 50ms.

## Test Requirements

- [ ] Unit tests: Cell renders empty state correctly (no mark displayed).
- [ ] Unit tests: Cell renders X mark when value is 'X'.
- [ ] Unit tests: Cell renders O mark when value is 'O'.
- [ ] Unit tests: Click handler fires placeMove with correct arguments on an active empty cell.
- [ ] Unit tests: Click handler does not fire on a filled cell.
- [ ] Unit tests: Click handler does not fire on a cell in an inactive board.
- [ ] Integration tests: React.memo prevents re-render when an unrelated cell changes (verify with render count or mock).

## Implementation Notes

- Use a Zustand selector to read only the specific cell value: `useGameStore(state => state.boards[boardIndex][cellIndex])`.
- Use a second selector for active state: `useGameStore(state => state.activeBoards.includes(boardIndex))`.
- The Cell click handler should be a simple inline call: `() => placeMove(boardIndex, cellIndex)`. The store handles all validation.
- Use `cursor: pointer` on active empty cells and `cursor: default` on filled or inactive cells.
- Mark rendering can use simple text (X/O) or SVG; text is simpler for v1.
- The 50ms response requirement is met naturally by React's synchronous state update + re-render cycle with Zustand.

## Out of Scope

- Hover states and tint effects (S14)
- Last-move indicator styling (S16)
- Keyboard navigation between cells (S23)
- ARIA attributes on cells (S24)
