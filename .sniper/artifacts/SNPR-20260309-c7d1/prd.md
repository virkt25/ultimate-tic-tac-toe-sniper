# Product Requirements Document — Ultimate Tic Tac Toe

**Sprint:** SNPR-20260309-c7d1
**Date:** 2026-03-09
**Author:** Product Manager Agent

---

## Overview

A local two-player Ultimate Tic Tac Toe game rendered in a single-page web application. The game is played on a 3x3 grid of 3x3 tic-tac-toe boards (81 cells total). Players alternate turns on the same browser window. The product goal is a polished, animated, dark-themed game that is intuitive to play without reading external rules.

---

## Requirements

### FR-1: Game Board Display

**FR-1.1:** The system shall render a 3x3 meta-board where each cell contains a 3x3 sub-board, producing a total of 81 playable cells.

_Acceptance test:_ On page load, the board is visible with 9 distinct sub-boards, each containing 9 cells, for a total of 81 individually identifiable cells.

**FR-1.2:** The system shall visually separate sub-boards from one another with thicker borders or spacing so that the two levels of the grid are clearly distinguishable.

_Acceptance test:_ A first-time player can identify the 9 sub-board boundaries without instruction.

### FR-2: Turn Management

**FR-2.1:** The system shall designate X as the first player.

_Acceptance test:_ On a new game, clicking any cell places an X mark.

**FR-2.2:** When a player places a mark, the system shall switch the active player to the other player.

_Acceptance test:_ After X places a mark, the next valid click places an O, and vice versa.

**FR-2.3:** The system shall display the current player (X or O) at all times during an active game.

_Acceptance test:_ A status area shows whose turn it is, and it updates after every move.

### FR-3: Move Constraint (Core Mechanic)

**FR-3.1:** When a player places a mark in a cell at position (row, col) within a sub-board, the system shall constrain the next player to play only within the sub-board at meta-board position (row, col).

_Acceptance test:_ Player X places a mark in the top-right cell of any sub-board. Player O's only valid moves are within the top-right sub-board.

**FR-3.2:** The system shall visually highlight the sub-board(s) where the current player is allowed to move.

_Acceptance test:_ After each move, exactly one sub-board (or all playable sub-boards during a free move) is visually distinguished as active. Non-active sub-boards appear dimmed or de-emphasized.

**FR-3.3:** If a player is sent to a sub-board that is already won or fully filled, the system shall allow that player to play in any cell on any playable (not won, not full) sub-board.

_Acceptance test:_ Player is sent to a won sub-board. All remaining playable sub-boards become highlighted. The player can click any empty cell in any of those sub-boards.

**FR-3.4:** While a sub-board is won or fully filled, the system shall prevent any player from placing a mark in that sub-board.

_Acceptance test:_ Clicking any cell in a won or full sub-board has no effect regardless of the active constraint.

### FR-4: Sub-Board Victory

**FR-4.1:** When a player completes three in a row (horizontally, vertically, or diagonally) within a sub-board, the system shall mark that sub-board as won by that player.

_Acceptance test:_ Player X gets three in a row in the center sub-board. The center sub-board is recorded as won by X.

**FR-4.2:** When a sub-board is won, the system shall display a large X or O overlay on that sub-board, clearly indicating the winner.

_Acceptance test:_ A won sub-board shows a prominent player symbol covering the sub-board area, distinct from the individual cell marks.

**FR-4.3:** When a sub-board is fully filled with no three-in-a-row for either player, the system shall mark that sub-board as drawn. A drawn sub-board counts for neither player on the meta-board.

_Acceptance test:_ A fully filled sub-board with no winner does not display a win overlay for either player and is not counted toward either player's meta-board line.

### FR-5: Game Victory and Draw

**FR-5.1:** When a player wins three sub-boards in a row on the meta-board (horizontally, vertically, or diagonally), the system shall declare that player as the game winner.

_Acceptance test:_ Player O wins the left column of sub-boards (positions 0,0 / 1,0 / 2,0). The system announces O as the winner.

**FR-5.2:** When the game is won, the system shall display a victory message identifying the winning player.

_Acceptance test:_ A clear textual message (e.g., "Player X Wins!") is displayed upon game completion.

**FR-5.3:** When the game is won, the system shall prevent any further moves.

_Acceptance test:_ After a winner is declared, clicking any cell on the board has no effect.

**FR-5.4:** When all 9 sub-boards are decided (won or fully filled) and no player has three sub-boards in a row, the system shall declare the game a draw.

_Acceptance test:_ All sub-boards are decided, neither player has three in a row on the meta-board. The system displays a draw message.

**FR-5.5:** If during play no possible sequence of future moves can give either player three sub-boards in a row, the system shall declare the game a draw.

_Acceptance test:_ Enough sub-boards are decided such that neither player can possibly achieve three in a row. The game ends as a draw even if some sub-boards still have empty cells.

### FR-6: Invalid Move Prevention

**FR-6.1:** While it is Player X's turn, the system shall reject any attempt by Player O to place a mark, and vice versa.

_Acceptance test:_ Since this is a shared-screen game with alternating clicks, this is enforced implicitly by the turn system — each click belongs to the current active player.

**FR-6.2:** If a cell already contains a mark, then the system shall prevent placing another mark in that cell.

_Acceptance test:_ Clicking an occupied cell produces no change to the board state.

**FR-6.3:** If a player clicks a cell in a sub-board that is not currently active (per FR-3.1), the system shall ignore the click.

_Acceptance test:_ During a constrained turn, clicking a cell outside the active sub-board produces no change.

### FR-7: First Move (Free Move)

**FR-7.1:** The system shall allow the first player (X) to place a mark in any empty cell on the board, since no prior move exists to determine a constraint.

_Acceptance test:_ On a new game, all 81 cells are clickable for Player X. All 9 sub-boards are highlighted as active.

### FR-8: New Game

**FR-8.1:** The system shall provide a "New Game" button that resets all game state to the initial state.

_Acceptance test:_ Mid-game, clicking "New Game" clears all marks, resets the board, sets the current player to X, and highlights all sub-boards as active.

**FR-8.2:** The system shall make the "New Game" button accessible at all times (during play, after a win, after a draw).

_Acceptance test:_ The button is visible and functional in all game states.

### FR-9: Visual Design

**FR-9.1:** The system shall use a dark color theme for all UI elements.

_Acceptance test:_ The background is dark, text and interactive elements use light/bright colors that contrast against the dark background.

**FR-9.2:** The system shall use two distinct colors to differentiate Player X and Player O marks, overlays, and status indicators.

_Acceptance test:_ X marks and O marks are rendered in visually distinct colors that are consistent throughout the UI (cells, overlays, turn indicator).

**FR-9.3:** When a mark is placed, the system shall animate the mark's appearance.

_Acceptance test:_ Placing a mark triggers a visible entrance animation (e.g., scale, fade, or draw-in) rather than an instant appearance.

**FR-9.4:** When a sub-board is won, the system shall animate the overlay appearance.

_Acceptance test:_ The large X or O overlay animates into view (e.g., scale-up, fade-in) rather than appearing instantly.

**FR-9.5:** When the game is won, the system shall display a celebration animation.

_Acceptance test:_ A visible animation or effect plays when a player wins the game, distinct from normal gameplay animations.

### FR-10: Responsive Layout

**FR-10.1:** The system shall display optimally on desktop viewports (1024px and above).

_Acceptance test:_ On a 1440px-wide viewport, the game board and controls are well-proportioned with no overflow or scrolling needed to see the full board.

**FR-10.2:** The system shall remain functional on tablet viewports (768px to 1023px).

_Acceptance test:_ On a 768px-wide viewport, all 81 cells are visible and tappable. The layout may reflow but the game is fully playable.

**FR-10.3:** While on viewports narrower than 768px, the system shall remain usable but is not required to meet minimum touch target sizes.

_Acceptance test:_ On a 375px-wide viewport, the board renders without horizontal overflow. Cells may be small but are still tappable.

### FR-11: Accessibility (Baseline)

**FR-11.1:** The system shall ensure all interactive cells have sufficient color contrast against their background (WCAG 2.1 AA: 4.5:1 for text, 3:1 for UI components).

_Acceptance test:_ Player marks and active board highlights meet WCAG AA contrast ratios against the dark background.

**FR-11.2:** The system shall provide keyboard navigation so that all cells can be reached and activated using keyboard-only input.

_Acceptance test:_ A user can tab/arrow through cells and press Enter/Space to place a mark without using a mouse.

### NFR-1: Performance

**NFR-1.1:** The system shall render all 81 cells and respond to user input without perceptible lag (under 100ms response to click).

_Acceptance test:_ Placing a mark results in a visible UI update within 100ms on a modern desktop browser.

**NFR-1.2:** The system shall run animations at 60fps without dropped frames on modern desktop hardware.

_Acceptance test:_ Animations run smoothly with no visible jank when profiled in Chrome DevTools.

### NFR-2: Code Quality

**NFR-2.1:** The game engine logic (move validation, win detection, state transitions) shall be separated from the UI rendering layer.

_Acceptance test:_ Engine logic can be unit tested without rendering any UI components.

**NFR-2.2:** The game engine shall have unit test coverage for: valid move placement, invalid move rejection, sub-board win detection, meta-board win detection, draw detection, free move triggering, and turn alternation.

_Acceptance test:_ A test suite exists and passes covering each of the listed scenarios.

---

## Success Criteria

1. **Playable game:** Two players can complete a full game of Ultimate Tic Tac Toe from start to finish, with correct enforcement of all rules (move constraints, sub-board wins, game win, draw).
2. **Rule correctness:** All seven canonical rules listed in the discovery brief are correctly implemented, with no edge-case violations (particularly: free move when sent to a completed board, and early draw detection).
3. **Visual clarity:** A player unfamiliar with the game can identify which sub-board is active, whose turn it is, and which sub-boards have been won, without external instructions.
4. **Animation quality:** Mark placement, sub-board win overlays, and game-win celebration are all animated with smooth transitions (no instant pop-in, no jank).
5. **Engine test suite passes:** All unit tests for the game engine pass, covering the scenarios listed in NFR-2.2.
6. **Desktop experience:** The game is visually polished and fully playable at 1024px+ viewport widths.
7. **Tablet experience:** The game is fully playable at 768px+ viewport widths.

---

## Out of Scope

- **AI opponent / single-player mode.** No computer player. Local two-player only.
- **Online multiplayer / networking.** No backend, no WebSocket, no peer-to-peer connections.
- **User accounts or authentication.** No login, no profiles, no saved preferences.
- **Persistent game state.** No saving or loading games across browser sessions or page refreshes.
- **Undo/redo functionality.** The only way to restart is the "New Game" button.
- **Sound effects or audio.** No audio of any kind.
- **Move timer or clock.** No time pressure mechanics.
- **Variant rules.** Only standard rules. No "drawn board counts for both" variant.
- **Internationalization.** English only.
- **Light mode or theme toggle.** Dark mode only.
- **Deployment or hosting.** Local development server only (`npm run dev`).
- **Tournament, ranking, or scoring system.** No persistent statistics.
- **Mobile-optimized experience.** Phones are functional but not a priority. Touch targets may be below recommended minimums on small screens.
