import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CellIndex, GameState, SubBoardIndex } from '../engine/types';
import { createInitialState, makeMove, isValidMove as checkValid } from '../engine/engine';

interface GameStore extends GameState {
  play: (subBoard: SubBoardIndex, cell: CellIndex) => void;
  reset: () => void;
  isValidMove: (subBoard: SubBoardIndex, cell: CellIndex) => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      play: (subBoard: SubBoardIndex, cell: CellIndex) => {
        const state = get();
        const gameState: GameState = {
          board: state.board,
          subBoardStatus: state.subBoardStatus,
          currentPlayer: state.currentPlayer,
          activeSubBoard: state.activeSubBoard,
          lastMove: state.lastMove,
          gameOutcome: state.gameOutcome,
          moveCount: state.moveCount,
        };

        if (!checkValid(gameState, subBoard, cell)) return;

        const next = makeMove(gameState, subBoard, cell);
        set(next);
      },

      reset: () => {
        set(createInitialState());
      },

      isValidMove: (subBoard: SubBoardIndex, cell: CellIndex) => {
        const state = get();
        const gameState: GameState = {
          board: state.board,
          subBoardStatus: state.subBoardStatus,
          currentPlayer: state.currentPlayer,
          activeSubBoard: state.activeSubBoard,
          lastMove: state.lastMove,
          gameOutcome: state.gameOutcome,
          moveCount: state.moveCount,
        };
        return checkValid(gameState, subBoard, cell);
      },
    }),
    {
      name: 'ultimate-ttt-game',
    },
  ),
);
