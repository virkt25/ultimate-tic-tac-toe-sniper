# Story S10: Implement MetaBoard and SubBoard components

> **Epic:** E04-board-rendering
> **Complexity:** L
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S08

## Description

Create MetaBoard.tsx (3x3 grid of SubBoards using CSS Grid) and SubBoard.tsx (3x3 grid of Cells, memoized with React.memo). MetaBoard reads activeBoards from the store and passes boardIndex to each SubBoard. SubBoard renders 9 Cell placeholders. Also create Game.tsx as the root container and App.tsx entry point with ErrorBoundary.

## Embedded Context

### From PRD

- **FR-001:** Render a 3x3 meta-grid where each cell contains a 3x3 sub-grid, totaling 81 playable cells.
- **FR-002:** The entire game board must fit within a single viewport without scrolling on screens 320px and wider.
- **FR-003:** The board must scale proportionally with square cells maintained at all sizes.
- **US-001:** As a player, I want the game to load instantly so I can start playing without delay.
- **US-002:** As a player, I want to place marks on the correct board so my moves register where intended.
- **US-007:** As a player, I want the game to be responsive so I can play on any device.

### From Architecture

- **Game.tsx** — Root container component with no props. Reads state from the Zustand game store. Renders the component hierarchy: TurnIndicator + MetaBoard + GameStatusBar + GameOverOverlay.
- **MetaBoard.tsx** — Renders a 3x3 CSS Grid of SubBoard components. No props; reads activeBoards from the store to pass down context.
- **SubBoard.tsx** — Renders a 3x3 CSS Grid of Cell components. Props: `{ boardIndex: BoardIndex }`. Wrapped in `React.memo` to prevent unnecessary re-renders when unrelated boards change.
- **App.tsx** — Minimal wrapper that renders Game. Includes an ErrorBoundary at this level.
- **main.tsx** — Entry point that mounts the React app to the DOM root element.
- **ErrorBoundary** — Class component at the App level. Fallback UI displays "Something went wrong — click to restart" and resets state on click.

### From UX Spec

- **MetaBoard states:** initial (all 9 sub-boards active), playing (mix of active/inactive/won/drawn), freeMove (multiple sub-boards highlighted as active), gameOver (all boards frozen, no interaction).
- **MetaBoard accessibility:** `role="grid"`, `aria-label="Ultimate Tic-Tac-Toe game board"`.
- **SubBoard accessibility:** `role="group"`, `aria-label` describing the sub-board position (e.g., "Sub-board top-left").
- **Component hierarchy:** App > Game > TurnIndicator + MetaBoard + GameStatusBar + GameOverOverlay. MetaBoard > SubBoard(x9) > Cell(x9).
- **Content hierarchy:** The game board dominates the viewport, occupying 70-80% of the visible area.

## Acceptance Criteria

1. **Given** initial game state, **When** the Game component renders, **Then** 9 SubBoards are visible arranged in a 3x3 grid.
2. **Given** a SubBoard, **When** it is rendered, **Then** 9 Cell slots are visible arranged in a 3x3 grid within the SubBoard.
3. **Given** a boardIndex prop, **When** the SubBoard renders, **Then** it reads state for that specific board from the Zustand store.
4. **Given** a SubBoard wrapped in React.memo, **When** an unrelated board's state changes, **Then** the SubBoard does not re-render.
5. **Given** a JavaScript error thrown inside the Game component tree, **When** the ErrorBoundary catches it, **Then** a "Something went wrong — click to restart" fallback UI is displayed.

## Test Requirements

- [ ] Unit tests: Game renders without crashing and contains a MetaBoard.
- [ ] Unit tests: MetaBoard renders 9 SubBoard components.
- [ ] Unit tests: SubBoard renders 9 Cell placeholder elements.
- [ ] Unit tests: ErrorBoundary displays fallback when a child throws.
- [ ] Integration tests: Full Game render produces 81 cell elements in the DOM.

## Implementation Notes

- Use CSS Grid with `grid-template-columns: repeat(3, 1fr)` for both MetaBoard and SubBoard layouts.
- MetaBoard gap property provides visual separation between sub-boards (larger gap).
- SubBoard gap property provides visual separation between cells (smaller gap, simulating cell borders).
- Initial implementation should target desktop sizing; responsive breakpoints are handled in S20 (E07).
- SubBoard should use a Zustand selector for `activeBoards` to minimize re-render scope: `useGameStore(state => state.activeBoards)`.
- ErrorBoundary must be a class component (React error boundaries do not support hooks).

## Out of Scope

- Cell click handling (S11)
- Styling and design tokens (S12)
- Active board highlighting (S14)
- Sub-board win/draw overlays (S15)
- Responsive layout and breakpoints (S20)
- Accessibility roles and ARIA beyond structural roles (S23-S25)
