import type { GameState } from './types';

/** All 8 winning line index triples for a 3x3 grid */
export const WIN_LINES: ReadonlyArray<readonly [number, number, number]> = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/** Creates a fresh initial game state. Returns a new object each call (no shared refs). */
export function createInitialState(): GameState {
  return {
    boards: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)),
    boardResults: Array.from({ length: 9 }, () => null),
    activeBoardIndex: null,
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
  };
}
