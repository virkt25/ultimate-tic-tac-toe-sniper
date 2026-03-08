# S09: Game Controls

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S09
**Dependencies:** S03, S07

---

## Summary

Implement the `Controls` component with New Game and Undo buttons. The undo function uses the replay-based approach defined in the architecture (replay all moves except the last on a fresh state). The New Game button resets to initial state.

## Architecture Reference

- **Plan section 3** — Game Engine API (`undoMove` — replay-based undo)
- **Plan section 4** — State Management (`undo()`, `reset()` actions; `canUndo` derived from moveHistory length)
- **Plan section 5** — Component Tree (Controls component responsibilities)
- **ADR-4** — Replay-based undo
- **PRD section 4.3** — Controls (New Game, Undo)

## Acceptance Criteria

1. **Event-driven:** When the user clicks the "New Game" button, the system shall reset the game to the initial state with empty boards, player X's turn, and no move history.
2. **Event-driven:** When the user clicks the "Undo" button, the system shall revert to the game state before the last move was made using replay-based undo.
3. **State-driven:** While the move history is empty (no moves have been made), the Undo button shall be disabled.
4. **Event-driven:** When undo is performed, the system shall correctly restore the previous player's turn, the previous active board constraint, and all board results.
5. **Event-driven:** When undo is performed on a move that had won a sub-board, the system shall revert that sub-board's result back to in-progress.
6. **Ubiquitous:** The Controls component shall render both buttons in a clearly accessible location below the game board.
