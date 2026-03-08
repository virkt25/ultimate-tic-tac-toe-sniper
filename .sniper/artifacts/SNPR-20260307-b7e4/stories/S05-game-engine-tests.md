# S05: Game Engine Unit Tests

## Description
Write comprehensive unit tests for the game engine covering all rules, edge cases, and state transitions.

## Acceptance Criteria (EARS)
- When the test suite is run, the system shall verify that the send rule correctly constrains the next player's move to the sub-board matching the cell position of the previous move.
- When the test suite is run, the system shall verify that a free move is granted when the send rule targets a won sub-board, a drawn sub-board, or on the first move of the game.
- When the test suite is run, the system shall verify that invalid moves are rejected (occupied cell, wrong sub-board under constraint, move in won sub-board, move in drawn sub-board, move after game over).
- When the test suite is run, the system shall verify sub-board wins (all 8 winning patterns), sub-board draws, meta-board wins (all 8 winning patterns), and meta-board draws.
- When the test suite is run, the system shall verify the edge case where a move wins a sub-board and simultaneously triggers a free move for the opponent (because the send target is now won).

## Dependencies
- S04: Win and Draw Detection

## Notes
- Place tests in `src/engine/engine.test.ts`
- Test edge case: move that wins a sub-board AND wins the meta-board simultaneously
- Test edge case: move that wins a sub-board where the send target is the just-won board
- Test a full game sequence ending in a win and one ending in a draw
- Aim for high coverage of the engine module -- this is the highest-risk component
