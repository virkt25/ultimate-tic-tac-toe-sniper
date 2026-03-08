# S04: Win Detection

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S04
**Dependencies:** S02

---

## Summary

Implement win and draw detection at both the sub-board and meta-board levels. This includes `checkBoardWin` (checking all 8 winning lines), `checkBoardDraw` (full board with no winner), and the meta-board win/draw logic that determines the overall game outcome. These functions are used by `makeMove` (S03) to update `boardResults` and `winner`.

## Architecture Reference

- **Plan section 3** — Game Engine API (`checkBoardWin`, `checkBoardDraw` specifications)
- **Spec section 2.1** — Win detection for small boards and meta board
- **Spec section 1** — Edge Cases (drawn small boards, game draw condition)

## Acceptance Criteria

1. **Event-driven:** When `checkBoardWin` is called with a board where a player occupies all three cells of any winning line (3 rows, 3 columns, 2 diagonals), the system shall return that player.
2. **Event-driven:** When `checkBoardWin` is called with a board that has no completed winning line, the system shall return `null`.
3. **Event-driven:** When `checkBoardDraw` is called with a board that is fully occupied and has no winner, the system shall return `true`.
4. **Event-driven:** When `checkBoardDraw` is called with a board that has empty cells or has a winner, the system shall return `false`.
5. **Event-driven:** When a move causes a player to hold three sub-boards in a row on the meta-board, the system shall set `winner` to that player.
6. **Event-driven:** When all 9 sub-boards are resolved (won or drawn) and no player holds three in a row on the meta-board, the system shall set `winner` to `'draw'`.
7. **State-driven:** While the meta-board has unresolved sub-boards and no player has three in a row, the system shall keep `winner` as `null`.
