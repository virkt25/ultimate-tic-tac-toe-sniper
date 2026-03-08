# S09: Game Controls

## Description
Add a turn indicator showing whose turn it is, a new game button to reset the board, and a game over display showing the result.

## Acceptance Criteria (EARS)
- While a game is in progress, the system shall prominently display whose turn it is (Player X or Player O) in a turn indicator visible without scrolling.
- When the current player changes after a move, the system shall update the turn indicator to reflect the new current player.
- When a player clicks the "New Game" button, the system shall reset the entire game state to its initial configuration (empty board, Player X's turn, no constraints).
- When the game ends in a win, the system shall display a game over message identifying the winning player and offering an option to start a new game.
- When the game ends in a draw, the system shall display a game over message indicating a draw and offering an option to start a new game.

## Dependencies
- S07: Game Interaction

## Notes
- The turn indicator should use visual differentiation (color, icon) in addition to text to indicate the current player
- The new game button should be available at all times, not just at game over
- The game over display can be an overlay, inline message, or modal -- the key requirement is that it is clearly visible and does not require scrolling to see
- Consider whether the game over state should dim or disable the board
