export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type SubBoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SubBoardStatus =
  | { result: 'playing' }
  | { result: 'won'; winner: Player }
  | { result: 'draw' };

export interface GameState {
  /** board[subBoardIndex][cellIndex] */
  board: CellValue[][];
  subBoardStatus: SubBoardStatus[];
  currentPlayer: Player;
  /** null = free move (player can play in any active sub-board) */
  activeSubBoard: SubBoardIndex | null;
  lastMove: { subBoard: SubBoardIndex; cell: CellIndex } | null;
  gameOutcome: { result: 'win'; winner: Player } | { result: 'draw' } | null;
  moveCount: number;
}
