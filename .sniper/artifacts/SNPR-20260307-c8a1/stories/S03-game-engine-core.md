# S03: Game Engine Core

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S03
**Dependencies:** S02

---

## Summary

Implement the core game engine functions: `makeMove`, `isValidMove`, and `getValidBoards`. These are pure functions that operate on `GameState` and enforce all game rules for move placement, validation, and board constraint logic.

## Architecture Reference

- **Plan section 3** — Game Engine API (`makeMove`, `isValidMove`, `getValidBoards` specifications)
- **ADR-1** — Pure engine with no UI coupling
- **ADR-4** — Replay-based undo (moveHistory tracking in makeMove)
- **Spec section 2.1** — Game Engine requirements (move validation, active board constraint)
- **Spec section 1** — Core Rules and Edge Cases (sent-to-won-board, sent-to-full-board)

## Acceptance Criteria

1. **Event-driven:** When `makeMove` is called with a valid move, the system shall return a new `GameState` with the mark placed, the current player toggled, and the move appended to `moveHistory`.
2. **Event-driven:** When `makeMove` places a mark that sends the opponent to an unresolved board, the system shall set `activeBoard` to the target board index (equal to `move.cellIndex`).
3. **Event-driven:** When `makeMove` places a mark that sends the opponent to an already-won or drawn board, the system shall set `activeBoard` to `null` (free choice).
4. **Event-driven:** When `isValidMove` is called, the system shall return `false` if any of these conditions hold: the game is over, the target board is resolved, the target cell is occupied, or the move violates the active board constraint.
5. **Event-driven:** When `getValidBoards` is called with a set `activeBoard` that is still open, the system shall return an array containing only that board index.
6. **Event-driven:** When `getValidBoards` is called with `activeBoard` set to `null` or pointing to a resolved board, the system shall return all board indices where `boardResults[i]` is `null`.
7. **Ubiquitous:** All engine functions shall be pure — they shall not mutate the input `GameState` and shall have no side effects.
