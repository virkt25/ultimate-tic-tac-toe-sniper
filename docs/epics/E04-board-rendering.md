# Epic E04: Board Rendering

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 18
> **Dependencies:** E03-state-management

## Scope

### In Scope
- MetaBoard component (3x3 grid of sub-boards)
- SubBoard component (3x3 grid of cells, memoized)
- Cell component (individual cell, memoized, click handling)
- Game root container component
- CSS Grid layout for the board
- CSS Modules styling with design tokens
- App entry point and HTML shell

### Out of Scope
- TurnIndicator (E05)
- Active board highlighting (E05)
- Sub-board win/draw overlays (E05)
- GameOverOverlay (E06)
- Responsive breakpoints (E07)
- Accessibility/ARIA (E08)

## Architecture Context

### UI Components

#### `Game.tsx` — Root Game Container
- Top-level layout. Renders turn indicator, meta-board, game-over overlay, new game button.
- No props — reads from store directly.

#### `MetaBoard.tsx` — Meta-Grid
- Renders 3x3 grid of sub-boards using CSS Grid.
- No props — reads activeBoards from store.

#### `SubBoard.tsx` — Sub-Grid (Memoized)
- Renders a single 3x3 grid of cells.
- Props: `{ boardIndex: BoardIndex }`
- Wrapped in `React.memo` — re-renders only when its specific board state changes.

#### `Cell.tsx` — Individual Cell (Memoized)
- Renders a single cell. Displays X, O, or empty. Handles click/tap events.
- Props: `{ boardIndex: BoardIndex, cellIndex: CellIndex }`
- Wrapped in `React.memo`.

### Design Tokens (from UX Spec)

| Token | Value |
|-------|-------|
| `--color-player-x` | #2563EB (blue-600) |
| `--color-player-o` | #DC2626 (red-600) |
| `--color-board-bg` | #FFFFFF |
| `--color-cell-border` | #D1D5DB (gray-300) |
| `--color-sub-board-gap` | #9CA3AF (gray-400) |
| `--color-text` | #111827 (gray-900) |

Typography: System font stack. Cell marks fill 60-70% of cell area.

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S10 | Implement MetaBoard and SubBoard components | L | S08 | frontend |
| S11 | Implement Cell component with click handling | M | S08 | frontend |
| S12 | Style game board with CSS Modules and design tokens | M | S10, S11 | frontend |

## Acceptance Criteria

1. The game renders a 9x9 grid (3x3 of 3x3) with 81 interactive cells
2. Clicking an empty cell in any board calls `placeMove` with correct board and cell indices
3. Cells display X or O marks after being placed
4. SubBoard re-renders only when its own board state changes (verified via React DevTools)
5. Cell re-renders only when its own value changes
6. CSS Grid layout displays the board with visible sub-board gaps
7. Design tokens (colors, typography) are applied via CSS custom properties
8. Board renders in a single viewport without scrolling on desktop

## Technical Notes

- Use CSS Grid for both MetaBoard (3x3) and SubBoard (3x3) layouts
- MetaBoard uses `gap` for sub-board separation; SubBoard uses `gap` for cell borders
- Cell click handler: `onClick={() => placeMove(boardIndex, cellIndex)}`
- React.memo on SubBoard and Cell is critical for performance with 81 cells
- Initial implementation renders at desktop size; responsive adaptation is E07
