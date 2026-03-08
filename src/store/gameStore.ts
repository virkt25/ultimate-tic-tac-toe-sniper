import { create } from 'zustand';
import type { GameState, SubBoardIndex, CellIndex } from '../engine/types.ts';
import {
  createInitialState,
  makeMove as engineMakeMove,
  isValidMove as engineIsValidMove,
  getValidBoards as engineGetValidBoards,
  getWinningLine as engineGetWinningLine,
} from '../engine/engine.ts';

interface GameStore extends GameState {
  /** Make a move at the given sub-board and cell. */
  makeMove: (subBoard: SubBoardIndex, cell: CellIndex) => void;
  /** Reset the game to its initial state. */
  resetGame: () => void;
  /** Undo the last move by replaying all moves except the last. */
  undoMove: () => void;
  /** Check if a move is valid. */
  isValidMove: (subBoard: SubBoardIndex, cell: CellIndex) => boolean;
  /** Get sub-boards where the current player can play. */
  getValidBoards: () => SubBoardIndex[];
  /** Get the winning line on the meta-board, if any. */
  getWinningLine: () => readonly [number, number, number] | null;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  ...createInitialState(),

  makeMove: (subBoard: SubBoardIndex, cell: CellIndex) => {
    const state = get();
    const nextState = engineMakeMove(state, subBoard, cell);
    if (nextState !== state) {
      set(nextState);
    }
  },

  resetGame: () => {
    set(createInitialState());
  },

  undoMove: () => {
    const state = get();
    if (state.moveHistory.length === 0) return;

    const history = state.moveHistory.slice(0, -1);
    let newState = createInitialState();
    for (const move of history) {
      newState = engineMakeMove(newState, move.subBoard, move.cell);
    }
    set(newState);
  },

  isValidMove: (subBoard: SubBoardIndex, cell: CellIndex) => {
    return engineIsValidMove(get(), subBoard, cell);
  },

  getValidBoards: () => {
    return engineGetValidBoards(get());
  },

  getWinningLine: () => {
    return engineGetWinningLine(get().subBoardStatus);
  },
}));
