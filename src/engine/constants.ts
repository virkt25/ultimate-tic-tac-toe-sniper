/**
 * The 8 possible three-in-a-row winning patterns on a 3x3 grid.
 * Each pattern is a tuple of 3 indices (0-8) using flat indexing (row * 3 + col).
 */
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
] as const;

/** Number of cells per sub-board / sub-boards per meta-board */
export const BOARD_SIZE = 9;

/** Sub-board/cell position labels for accessibility */
export const POSITION_LABELS: ReadonlyArray<string> = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;
