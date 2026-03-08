export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type SubBoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SubBoardStatus =
  | { result: 'playing' }
  | { result: 'won'; winner: Player }
  | { result: 'draw' };

export interface GameState {
  /** board[subBoardIndex][cellIndex] — 9 arrays of 9 cells */
  board: CellValue[][];
  /** Status of each of the 9 sub-boards */
  subBoardStatus: SubBoardStatus[];
  /** Whose turn it is */
  currentPlayer: Player;
  /** Which sub-board the current player must play in, or null for free move */
  activeSubBoard: SubBoardIndex | null;
  /** The last move played, for highlighting */
  lastMove: { subBoard: SubBoardIndex; cell: CellIndex } | null;
  /** Overall game outcome, null while game is in progress */
  gameOutcome: { result: 'win'; winner: Player } | { result: 'draw' } | null;
  /** Total number of moves played */
  moveCount: number;
  /** History of all moves for replay-based undo */
  moveHistory: { subBoard: SubBoardIndex; cell: CellIndex }[];
}
