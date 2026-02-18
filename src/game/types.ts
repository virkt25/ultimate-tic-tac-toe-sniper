/** The two players */
export type Player = 'X' | 'O';

/** A cell can be occupied by a player or empty */
export type CellValue = Player | null;

/** Index for a sub-board on the meta-board (0-8, left-to-right, top-to-bottom) */
export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Index for a cell within a sub-board (0-8, left-to-right, top-to-bottom) */
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Status of an individual sub-board */
export type SubBoardStatus = 'in-progress' | 'won-x' | 'won-o' | 'draw';

/** Result of a completed game */
export type GameResult = { winner: Player } | { draw: true };

/** A move specifies which sub-board and which cell */
export type Move = { board: BoardIndex; cell: CellIndex };

/** Result of attempting a move */
export type MoveResult = { success: true; state: GameState } | { success: false; reason: string };

/** Complete game state */
export interface GameState {
  boards: CellValue[][];
  subBoardStatus: SubBoardStatus[];
  currentPlayer: Player;
  activeBoards: BoardIndex[] | 'all';
  gameResult: GameResult | null;
  lastMove: Move | null;
  winningLine: BoardIndex[] | null;
}

/** Win patterns for tic-tac-toe (rows, columns, diagonals) */
export const WIN_PATTERNS: readonly [number, number, number][] = [
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
