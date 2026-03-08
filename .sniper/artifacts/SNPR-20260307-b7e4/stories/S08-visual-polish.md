# S08: Visual Polish

## Description
Add last move indicator, sub-board ownership overlays (won/drawn), winning line display on the meta-board, and hover states for interactive cells.

## Acceptance Criteria (EARS)
- When a move is made, the system shall visually highlight the most recently played cell so both players can see what just happened (e.g., distinct background color or border).
- When a sub-board is won by a player, the system shall display a large X or O overlay on that sub-board, making individual cells no longer visually prominent.
- When a sub-board is drawn, the system shall display a distinct visual treatment on that sub-board (e.g., greyed out or hatched pattern) indicating it is resolved with no winner.
- When the game is won, the system shall display a visual indicator of the winning three-in-a-row on the meta-board (e.g., a line drawn across the three winning sub-boards).
- When a player hovers over a valid, empty cell, the system shall display a hover state indicating the cell is interactive (e.g., background highlight or cursor change).

## Dependencies
- S07: Game Interaction

## Notes
- The last move indicator should persist until the next move is made
- Sub-board overlays should be semi-transparent or styled so the underlying cells are de-emphasized but still faintly visible
- The winning line can be implemented as a CSS overlay, SVG line, or similar technique
- Hover states should only appear on cells that are valid targets for the current player
