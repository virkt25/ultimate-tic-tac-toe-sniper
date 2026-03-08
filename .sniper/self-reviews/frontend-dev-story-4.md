# Story 4: Board UI Components -- Self-Review

## Summary

All Board UI components are implemented and wired to the game engine. The game is fully playable.

## Acceptance Criteria Checklist

- [x] 3x3 grid of SubBoards, each containing 3x3 Cells
- [x] Clicking a valid empty cell places mark and updates turn
- [x] Invalid clicks are ignored (cell is disabled, engine validates before applying)
- [x] GameStatus shows current player ("X to play" / "O to play"), winner, or draw
- [x] "New Game" button resets the board via `state.reset()`
- [x] Cells show cursor style based on validity (pointer vs default)

## Component Mapping

The story spec used placeholder names; the implemented components are:

| Story Spec      | Implemented        | Location                          |
|-----------------|--------------------|-----------------------------------|
| `App.tsx`       | `App.tsx`          | `src/components/App.tsx`          |
| `MetaBoard.tsx` | `MetaBoard.tsx`    | `src/components/MetaBoard.tsx`    |
| `SmallBoard`    | `SubBoard.tsx`     | `src/components/SubBoard.tsx`     |
| `Cell.tsx`      | `Cell.tsx`         | `src/components/Cell.tsx`         |
| `GameHeader`    | `GameStatus.tsx`   | `src/components/GameStatus.tsx`   |
| `GameControls`  | `Controls.tsx`     | `src/components/Controls.tsx`     |

## Architecture Decision: Zustand Store vs useReducer

The story spec called for `useReducer(gameReducer, ...)` but the codebase uses a Zustand store (`src/store/gameStore.ts`) that wraps the engine functions (`makeMove`, `isValidMove`, `createInitialState`). This is a better pattern because:

- Zustand provides `persist` middleware, giving the game state local storage persistence for free.
- The store encapsulates the GameState extraction logic, keeping components cleaner.
- No prop drilling needed -- components can selectively subscribe to slices.

Currently, App.tsx extracts the full GameState and passes it as props, which is fine for this component tree depth.

## Architecture Decision: CSS Modules vs Tailwind

The story spec called for Tailwind CSS, but Tailwind is not installed in the project. The codebase uses CSS modules throughout, which is the established pattern. The CSS modules provide:

- Scoped styles (no class name collisions)
- Responsive breakpoints at 767px and 499px
- CSS custom properties in `global.css` for a consistent color palette
- Animations for overlays and win lines

## Beyond Requirements

The implementation includes several enhancements beyond the acceptance criteria:

- **Keyboard navigation**: Arrow keys move focus between cells, skipping inactive sub-boards
- **Last move highlight**: Yellow border indicates the most recent move
- **Hover hints**: Valid empty cells show a faded preview of the current player's mark
- **Won/draw overlays**: Sub-boards show an overlay with the winner or "Draw" text
- **Winning line SVG**: An animated line drawn across the meta-board when a player wins
- **Accessibility**: ARIA roles, labels, and live regions for screen readers
- **Focus-visible styles**: Keyboard focus indicators on interactive elements

## Test Results

- 29 tests pass (engine: 25, store: 4)
- TypeScript compiles with no errors
- No lint warnings
