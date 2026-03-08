export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardResult = Player | 'draw' | null;

export interface GameState {
  boards: CellValue[][];        // boards[boardIndex][cellIndex], 9x9
  boardResults: BoardResult[];  // length 9
  activeBoardIndex: number | null;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
}

export type GameAction =
  | { type: 'PLAY_CELL'; boardIndex: number; cellIndex: number }
  | { type: 'NEW_GAME' };
