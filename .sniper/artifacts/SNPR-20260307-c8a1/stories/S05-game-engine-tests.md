# S05: Game Engine Tests

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S05
**Dependencies:** S03, S04

---

## Summary

Write comprehensive unit tests for the game engine covering move validation, win detection across all orientations, draw detection, board constraint logic, the undo mechanism, and the edge case of being sent to a won/drawn board. Target at least 90% coverage of the engine module.

## Architecture Reference

- **Plan section 3** — Game Engine API (all function signatures and behaviors)
- **Spec section 3.4** — Testing (Vitest, key test cases enumerated)
- **PRD section 6** — Success Metrics (>= 90% unit test coverage on game engine)

## Acceptance Criteria

1. **Ubiquitous:** The `src/engine/engine.test.ts` file shall contain unit tests for `makeMove`, `isValidMove`, `getValidBoards`, `checkBoardWin`, `checkBoardDraw`, and `undoMove`.
2. **Event-driven:** When a test invokes `checkBoardWin`, the test suite shall verify correct detection for all 8 winning line orientations (3 rows, 3 columns, 2 diagonals) for both players.
3. **Event-driven:** When a test plays a sequence of moves that sends a player to an already-won board, the test suite shall verify that `activeBoard` becomes `null` and the player can move on any open board.
4. **Event-driven:** When a test plays a sequence of moves leading to a meta-board win, the test suite shall verify that `winner` is set to the correct player.
5. **Event-driven:** When a test plays a sequence of moves leading to a game draw, the test suite shall verify that `winner` is set to `'draw'`.
6. **Event-driven:** When `undoMove` is called, the test suite shall verify the resulting state matches the state before the last move was made.
7. **Ubiquitous:** The engine test suite shall achieve at least 90% line coverage as reported by Vitest coverage.
