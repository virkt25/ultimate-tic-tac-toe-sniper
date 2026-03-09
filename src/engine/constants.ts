export const BOARD_SIZE = 3
export const TOTAL_CELLS = 9
export const TOTAL_BOARDS = 9

/** All possible three-in-a-row lines (indices into a 9-element array) */
export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
]
