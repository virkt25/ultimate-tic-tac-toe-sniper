# S06: Board Rendering

## Description
Create the MetaBoard, SubBoard, and Cell React components that render the game state as a nested 3x3-of-3x3 grid.

## Acceptance Criteria (EARS)
- When the application renders, the system shall display a 3x3 meta-board grid where each cell contains a 3x3 sub-board grid, totaling 81 visible cells.
- When a cell contains a player's mark (X or O), the system shall display that mark visually within the cell.
- While a sub-board is active (not won, not drawn), the system shall render all 9 cells of that sub-board as distinct, individually identifiable elements.
- The system shall render the board with a clear visual hierarchy that distinguishes meta-board grid lines from sub-board grid lines (e.g., thicker borders between sub-boards).
- When the game state changes, the system shall re-render only the affected portions of the board to reflect the new state.

## Dependencies
- S02: Game Types and Constants
- S05: Game Engine Tests (engine must be complete and tested before building UI on top of it)

## Notes
- Components: `MetaBoard`, `SubBoard`, `Cell` in `src/components/`
- At this stage, the board is display-only -- click handling comes in S07
- Use CSS Modules for styling
- The board should be centered on the page with reasonable default sizing
- Each cell should be a semantic HTML element (button or similar) to support future accessibility work
