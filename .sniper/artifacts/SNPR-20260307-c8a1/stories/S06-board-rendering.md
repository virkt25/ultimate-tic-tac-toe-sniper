# S06: Board Rendering

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S06
**Dependencies:** S01, S02

---

## Summary

Implement the visual rendering components: `MetaBoard`, `SubBoard`, and `Cell`. These components display the 3x3 grid of 3x3 sub-boards using CSS Grid, render X and O marks, and show win/draw overlays on resolved sub-boards. At this stage, components read from a Zustand store stub or props but do not handle click interactions.

## Architecture Reference

- **Plan section 5** — Component Tree (MetaBoard, SubBoard, Cell responsibilities and props)
- **Plan section 6** — Styling Approach (CSS Modules, grid layout, custom properties)
- **Plan section 4** — State Management (Zustand selectors for each component)

## Acceptance Criteria

1. **Ubiquitous:** The `MetaBoard` component shall render a 3x3 CSS Grid containing 9 `SubBoard` components.
2. **Ubiquitous:** Each `SubBoard` component shall render a 3x3 CSS Grid containing 9 `Cell` components.
3. **Event-driven:** When a sub-board's `boardResult` is a player (`'X'` or `'O'`), the `SubBoard` shall display a win overlay showing the winning player's mark prominently over the cell grid.
4. **Event-driven:** When a sub-board's `boardResult` is `'draw'`, the `SubBoard` shall display a distinct visual treatment indicating the board is dead/drawn.
5. **Ubiquitous:** Each `Cell` component shall render as a `<button>` element that displays the cell's value (`'X'`, `'O'`, or empty).
6. **Ubiquitous:** The `MetaBoard` shall use thicker visual separation between sub-boards than the separation between cells within a sub-board, creating a clear visual hierarchy.
7. **Ubiquitous:** The `App` component shall mount `GameStatus`, `MetaBoard`, and `Controls` in a single-column centered layout.
