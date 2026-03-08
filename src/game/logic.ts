import type { BoardResult, CellValue, GameState, Player } from './types';
import { WIN_LINES } from './constants';

/**
 * Validates whether a move is legal in the current game state.
 */
export function validateMove(
  state: GameState,
  boardIndex: number,
  cellIndex: number,
): boolean {
  // Game must not be over
  if (state.winner !== null || state.isDraw) return false;

  // Must play in the active board, or any non-decided board if activeBoardIndex is null
  if (state.activeBoardIndex !== null && state.activeBoardIndex !== boardIndex) return false;

  // Board must not already be decided
  if (state.boardResults[boardIndex] !== null) return false;

  // Cell must be empty
  if (state.boards[boardIndex][cellIndex] !== null) return false;

  return true;
}

/**
 * Checks a single 3x3 board (9 cells) for a winner or draw.
 * Returns the winning player, 'draw' if the board is full with no winner, or null if still in play.
 */
export function checkBoardResult(board: CellValue[]): BoardResult {
  // Check all 8 win lines
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  // If all cells are filled, it's a draw
  if (board.every((cell) => cell !== null)) {
    return 'draw';
  }

  // Still in play
  return null;
}

/**
 * Checks the meta-game result based on the 9 board results.
 * Uses the same win-line check. Draw if all 9 boards are decided and no winner.
 */
export function checkGameResult(
  boardResults: BoardResult[],
): { winner: Player | null; isDraw: boolean } {
  // Check win lines on the meta board
  for (const [a, b, c] of WIN_LINES) {
    const ra = boardResults[a];
    if (ra === 'X' || ra === 'O') {
      if (ra === boardResults[b] && ra === boardResults[c]) {
        return { winner: ra, isDraw: false };
      }
    }
  }

  // Check if all 9 boards are decided
  const allDecided = boardResults.every((r) => r !== null);
  if (allDecided) {
    return { winner: null, isDraw: true };
  }

  return { winner: null, isDraw: false };
}

/**
 * Determines the next active board based on the cell index just played.
 * If the target board (boardResults[cellIndex]) is already decided, returns null (free move).
 * Otherwise returns cellIndex.
 */
export function getNextActiveBoard(
  cellIndex: number,
  boardResults: BoardResult[],
): number | null {
  if (boardResults[cellIndex] !== null) {
    return null; // free move
  }
  return cellIndex;
}
