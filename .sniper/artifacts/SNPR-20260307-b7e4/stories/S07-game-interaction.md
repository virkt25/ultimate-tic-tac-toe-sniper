# S07: Game Interaction

## Description
Wire up click handling to dispatch moves through the game engine, implement turn flow, and add active sub-board highlighting to indicate where the current player must play.

## Acceptance Criteria (EARS)
- When a player clicks a valid cell, the system shall process the move through the game engine, update the game state, and re-render the board showing the new mark and toggled current player.
- When the send rule constrains the next move to a specific sub-board, the system shall visually highlight that sub-board as the active target (e.g., colored border or background).
- When the current player has a free move, the system shall visually highlight all active (non-won, non-drawn) sub-boards as valid targets.
- When a player clicks a cell that is not a valid move (occupied, wrong sub-board, won/drawn sub-board), the system shall not change the game state and the cell shall appear non-interactive.
- While the game is over (win or draw), the system shall prevent any further cell clicks from modifying the game state.

## Dependencies
- S06: Board Rendering

## Notes
- This story connects the UI layer to the game engine
- State management approach (useReducer or Zustand) is decided and implemented here
- Invalid cells should have `disabled` or equivalent treatment (no pointer cursor, reduced opacity or similar)
- Active board highlighting is a critical UX element -- it must be immediately obvious which sub-board(s) are playable
