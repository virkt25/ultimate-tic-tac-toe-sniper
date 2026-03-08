import type { GameAction, GameState } from './types';
import { createInitialState } from './constants';
import {
  validateMove,
  checkBoardResult,
  checkGameResult,
  getNextActiveBoard,
} from './logic';

/**
 * Pure reducer for the Ultimate Tic-Tac-Toe game.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY_CELL': {
      const { boardIndex, cellIndex } = action;

      // Validate the move
      if (!validateMove(state, boardIndex, cellIndex)) {
        return state;
      }

      // Place the mark
      const newBoards = state.boards.map((board) => [...board]);
      newBoards[boardIndex][cellIndex] = state.currentPlayer;

      // Check board result
      const newBoardResults = [...state.boardResults];
      const boardResult = checkBoardResult(newBoards[boardIndex]);
      newBoardResults[boardIndex] = boardResult;

      // Check game result
      const { winner, isDraw } = checkGameResult(newBoardResults);

      // Compute next active board (only if game is not over)
      const activeBoardIndex =
        winner !== null || isDraw
          ? null
          : getNextActiveBoard(cellIndex, newBoardResults);

      // Toggle player
      const nextPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

      return {
        boards: newBoards,
        boardResults: newBoardResults,
        activeBoardIndex,
        currentPlayer: nextPlayer,
        winner,
        isDraw,
      };
    }

    case 'NEW_GAME':
      return createInitialState();

    default:
      return state;
  }
}
