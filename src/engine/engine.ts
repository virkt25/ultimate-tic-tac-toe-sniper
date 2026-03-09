import type { BoardOutcome, CellValue, GameState, Player } from './types.ts'
import { TOTAL_BOARDS, TOTAL_CELLS, WIN_LINES } from './constants.ts'

/** Create a fresh game state */
export function createInitialState(): GameState {
  return {
    boards: Array.from({ length: TOTAL_BOARDS }, () =>
      Array.from<CellValue>({ length: TOTAL_CELLS }).fill(null),
    ),
    subBoardOutcomes: Array.from<BoardOutcome>({ length: TOTAL_BOARDS }).fill(null),
    currentPlayer: 'X',
    activeBoard: null,
    status: 'playing',
    winner: null,
    winningLine: null,
  }
}

/**
 * Check if a set of 9 values contains a three-in-a-row winner.
 * Works for both sub-board cells and meta-board outcomes.
 */
export function checkWinner(cells: readonly (CellValue | BoardOutcome)[]): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    const v = cells[a]
    if (v && v !== 'draw' && v === cells[b] && v === cells[c]) {
      return v as Player
    }
  }
  return null
}

/**
 * Determine which winning line (indices) achieved the win, if any.
 */
export function getWinningLine(cells: readonly (CellValue | BoardOutcome)[]): number[] | null {
  for (const [a, b, c] of WIN_LINES) {
    const v = cells[a]
    if (v && v !== 'draw' && v === cells[b] && v === cells[c]) {
      return [a, b, c]
    }
  }
  return null
}

/**
 * Determine the next active board based on the cell that was just played.
 * Returns the board index, or null if it's a free move (target board already decided).
 */
export function getNextActiveBoard(
  cellIndex: number,
  subBoardOutcomes: readonly BoardOutcome[],
): number | null {
  const target = cellIndex
  if (subBoardOutcomes[target] !== null) {
    return null // target board is decided → free move
  }
  return target
}

/**
 * Check if the meta-board is in an early-draw state:
 * neither player can achieve three in a row.
 */
export function isEarlyDraw(subBoardOutcomes: readonly BoardOutcome[]): boolean {
  // For each win line, check if it's still viable for X or O
  // A line is dead if it contains sub-boards won by both X and O,
  // or contains a drawn board blocking both players
  for (const [a, b, c] of WIN_LINES) {
    const vals = [subBoardOutcomes[a], subBoardOutcomes[b], subBoardOutcomes[c]]
    // Check if X can still win this line (no O wins and no draws blocking)
    const hasO = vals.some((v) => v === 'O')
    const hasDraw = vals.some((v) => v === 'draw')
    if (!hasO && !hasDraw) return false // X can still win this line
    // Check if O can still win this line
    const hasX = vals.some((v) => v === 'X')
    if (!hasX && !hasDraw) return false // O can still win this line
  }
  // If we also need to check individual player viability:
  // Check if X can win any line
  let xCanWin = false
  let oCanWin = false
  for (const [a, b, c] of WIN_LINES) {
    const vals = [subBoardOutcomes[a], subBoardOutcomes[b], subBoardOutcomes[c]]
    if (!vals.some((v) => v === 'O' || v === 'draw')) xCanWin = true
    if (!vals.some((v) => v === 'X' || v === 'draw')) oCanWin = true
  }
  return !xCanWin && !oCanWin
}

/**
 * Attempt to place the current player's mark.
 * Returns the new GameState if the move is valid, or null if invalid.
 */
export function makeMove(
  state: GameState,
  boardIndex: number,
  cellIndex: number,
): GameState | null {
  // Game must be in progress
  if (state.status !== 'playing') return null

  // Must play in the active board (or any playable board if activeBoard is null)
  if (state.activeBoard !== null && state.activeBoard !== boardIndex) return null

  // The sub-board must not be decided
  if (state.subBoardOutcomes[boardIndex] !== null) return null

  // The cell must be empty
  if (state.boards[boardIndex][cellIndex] !== null) return null

  // Place the mark (immutable update)
  const newBoards = state.boards.map((board, i) => {
    if (i !== boardIndex) return board
    const newBoard = [...board]
    newBoard[cellIndex] = state.currentPlayer
    return newBoard
  })

  // Check if this move wins the sub-board
  const newSubBoardOutcomes = [...state.subBoardOutcomes]
  const subWinner = checkWinner(newBoards[boardIndex])
  if (subWinner) {
    newSubBoardOutcomes[boardIndex] = subWinner
  } else if (newBoards[boardIndex].every((cell) => cell !== null)) {
    // Sub-board is full with no winner → draw
    newSubBoardOutcomes[boardIndex] = 'draw'
  }

  // Check if the game is won
  const metaWinner = checkWinner(newSubBoardOutcomes)
  const metaWinningLine = metaWinner ? getWinningLine(newSubBoardOutcomes) : null

  // Check for draw (all boards decided or early draw)
  const allDecided = newSubBoardOutcomes.every((o) => o !== null)
  const earlyDraw = !metaWinner && !allDecided && isEarlyDraw(newSubBoardOutcomes)
  const isDraw = !metaWinner && (allDecided || earlyDraw)

  // Determine next active board
  const nextActiveBoard =
    metaWinner || isDraw ? null : getNextActiveBoard(cellIndex, newSubBoardOutcomes)

  const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X'

  return {
    boards: newBoards,
    subBoardOutcomes: newSubBoardOutcomes,
    currentPlayer: nextPlayer,
    activeBoard: nextActiveBoard,
    status: metaWinner ? 'won' : isDraw ? 'draw' : 'playing',
    winner: metaWinner,
    winningLine: metaWinningLine,
  }
}
