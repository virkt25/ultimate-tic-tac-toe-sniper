/** The 8 possible three-in-a-row winning patterns (indices 0-8 on a 3x3 grid) */
export const WIN_PATTERNS: ReadonlyArray<readonly [number, number, number]> = [
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

export const BOARD_SIZE = 9;
