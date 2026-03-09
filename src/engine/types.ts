/** Cell value: empty, X, or O */
export type CellValue = null | 'X' | 'O'

/** Player identifier */
export type Player = 'X' | 'O'

/** Outcome of a sub-board or the meta-board */
export type BoardOutcome = null | 'X' | 'O' | 'draw'

/** Game status */
export type GameStatus = 'playing' | 'won' | 'draw'

/**
 * Complete game state — immutable between moves.
 * Passed to and returned from all engine functions.
 */
export interface GameState {
  /**
   * 9 sub-boards, each containing 9 cells.
   * boards[boardIndex][cellIndex] where both indices are 0-8.
   * Board layout (index mapping):
   *   0 | 1 | 2
   *   ---------
   *   3 | 4 | 5
   *   ---------
   *   6 | 7 | 8
   */
  boards: CellValue[][]

  /** Outcome of each sub-board (null = in progress) */
  subBoardOutcomes: BoardOutcome[]

  /** Current player */
  currentPlayer: Player

  /**
   * Index (0-8) of the sub-board the current player must play in.
   * null = free move (player can choose any playable sub-board).
   */
  activeBoard: number | null

  /** Overall game status */
  status: GameStatus

  /** Winner of the overall game (null if not yet won) */
  winner: Player | null

  /** Indices of the three winning sub-boards on the meta-board (for highlight) */
  winningLine: number[] | null
}
