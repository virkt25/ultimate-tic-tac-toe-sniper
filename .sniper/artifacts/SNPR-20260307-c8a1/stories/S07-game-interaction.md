# S07: Game Interaction

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S07
**Dependencies:** S03, S04, S06

---

## Summary

Wire up the Zustand store and connect game engine logic to the UI components. Clicking a cell places a mark, the turn indicator updates, and active/playable boards are visually highlighted. Invalid moves are silently prevented (cells are unclickable, not error-producing).

## Architecture Reference

- **Plan section 4** — State Management (Zustand store API: `placeMark`, selectors)
- **Plan section 5** — Component Tree (component responsibilities, `isActive`, `isPlayable` props)
- **Spec section 2.3** — Interactions (click to place, invalid moves prevented, hover feedback)
- **PRD section 4.2** — User Interface (active board highlighting, turn indicator)

## Acceptance Criteria

1. **Event-driven:** When a player clicks a valid cell, the system shall place the current player's mark in that cell and toggle the turn to the other player.
2. **State-driven:** While a sub-board is the active board (where the current player must play), the system shall visually highlight that sub-board with a distinct background color or border emphasis.
3. **State-driven:** While `activeBoard` is `null` (free choice), the system shall highlight all unresolved sub-boards as playable.
4. **State-driven:** While a cell is not a valid move target (wrong board, occupied cell, resolved board, or game over), the cell's button shall be disabled and unclickable.
5. **Event-driven:** When a player clicks a cell, the `GameStatus` component shall update to show the next player's turn.
6. **Event-driven:** When a player wins the game, the `GameStatus` component shall display the winner announcement.
7. **Event-driven:** When the game ends in a draw, the `GameStatus` component shall display a draw declaration.
8. **State-driven:** While a cell is playable and the user hovers over it, the system shall display a visual hover effect.
