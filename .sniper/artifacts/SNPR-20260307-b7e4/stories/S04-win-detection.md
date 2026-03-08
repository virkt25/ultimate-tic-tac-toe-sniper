# S04: Win and Draw Detection

## Description
Implement sub-board win/draw detection and meta-board win/draw detection, integrating these checks into the game engine's move processing.

## Acceptance Criteria (EARS)
- When a player completes three-in-a-row (horizontally, vertically, or diagonally) within a sub-board, the system shall mark that sub-board as won by that player and prevent further moves in it.
- When all 9 cells of a sub-board are filled with no three-in-a-row, the system shall mark that sub-board as drawn and prevent further moves in it.
- When a player wins three sub-boards in a row on the meta-board (horizontally, vertically, or diagonally), the system shall mark the game as won by that player and prevent further moves.
- When all 9 sub-boards are resolved (won or drawn) and no player has three-in-a-row on the meta-board, the system shall mark the game as a draw.
- When a move simultaneously wins a sub-board and wins the meta-board, the system shall correctly detect both and set the game outcome in a single state transition.

## Dependencies
- S03: Game Engine Core

## Notes
- Win checking uses the winning patterns constant from S02
- A won sub-board counts as that player's mark on the meta-board; a drawn sub-board counts for neither player
- Detection must be integrated into `makeMove` so the returned state always reflects the latest win/draw status
- Place detection functions in `src/engine/engine.ts` (or a separate `src/engine/detection.ts` if cleaner)
