import type { GameState, Player, CellValue, SubBoardIndex, CellIndex, SubBoardStatus } from './types.ts';
import { WIN_PATTERNS, BOARD_SIZE } from './constants.ts';

/**
 * Create a fresh initial game state.
 */
export function createInitialState(): GameState {
  const board: CellValue[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from<CellValue>({ length: BOARD_SIZE }).fill(null),
  );
  const subBoardStatus: SubBoardStatus[] = Array.from({ length: BOARD_SIZE }, () => ({
    result: 'playing' as const,
  }));

  return {
    board,
    subBoardStatus,
    currentPlayer: 'X',
    activeSubBoard: null,
    lastMove: null,
    gameOutcome: null,
    moveCount: 0,
    moveHistory: [],
  };
}

/**
 * Check if a sub-board (array of 9 cells) has been won by a player.
 * Returns the winning player or null.
 */
export function checkBoardWin(cells: CellValue[]): Player | null {
  for (const [a, b, c] of WIN_PATTERNS) {
    const v = cells[a];
    if (v !== null && v === cells[b] && v === cells[c]) {
      return v;
    }
  }
  return null;
}

/**
 * Check if a sub-board is drawn (all cells filled, no winner).
 */
export function checkBoardDraw(cells: CellValue[]): boolean {
  return cells.every((c) => c !== null) && checkBoardWin(cells) === null;
}

/**
 * Check if the meta-board has been won.
 * Maps sub-board statuses to a virtual 9-cell board and checks for three-in-a-row.
 */
export function checkMetaBoardWin(statuses: SubBoardStatus[]): Player | null {
  const metaCells: CellValue[] = statuses.map((s) =>
    s.result === 'won' ? s.winner : null,
  );
  return checkBoardWin(metaCells);
}

/**
 * Check if the meta-board is drawn (all sub-boards resolved, no winner).
 */
export function checkMetaBoardDraw(statuses: SubBoardStatus[]): boolean {
  const allResolved = statuses.every((s) => s.result !== 'playing');
  return allResolved && checkMetaBoardWin(statuses) === null;
}

/**
 * Get all sub-boards where the current player can legally play.
 */
export function getValidBoards(state: GameState): SubBoardIndex[] {
  if (state.gameOutcome !== null) return [];

  if (state.activeSubBoard !== null) {
    const status = state.subBoardStatus[state.activeSubBoard];
    if (status.result === 'playing') {
      return [state.activeSubBoard];
    }
  }

  // Free move: all playing sub-boards
  return state.subBoardStatus
    .map((s, i) => (s.result === 'playing' ? (i as SubBoardIndex) : -1))
    .filter((i): i is SubBoardIndex => i !== -1);
}

/**
 * Check if a specific move is valid.
 */
export function isValidMove(
  state: GameState,
  subBoard: SubBoardIndex,
  cell: CellIndex,
): boolean {
  if (state.gameOutcome !== null) return false;
  if (state.subBoardStatus[subBoard].result !== 'playing') return false;
  if (state.board[subBoard][cell] !== null) return false;

  const validBoards = getValidBoards(state);
  return validBoards.includes(subBoard);
}

/**
 * Get all valid moves for the current game state.
 */
export function getValidMoves(
  state: GameState,
): Array<{ subBoard: SubBoardIndex; cell: CellIndex }> {
  const validBoards = getValidBoards(state);
  const moves: Array<{ subBoard: SubBoardIndex; cell: CellIndex }> = [];

  for (const sb of validBoards) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (state.board[sb][c] === null) {
        moves.push({ subBoard: sb, cell: c as CellIndex });
      }
    }
  }

  return moves;
}

/**
 * Apply a move to the game state, returning a new state.
 * Validates the move, places the mark, checks sub-board and meta-board
 * win/draw, updates the active sub-board per the send rule, and
 * advances the turn.
 */
export function makeMove(
  state: GameState,
  subBoard: SubBoardIndex,
  cell: CellIndex,
): GameState {
  if (!isValidMove(state, subBoard, cell)) {
    return state;
  }

  // Clone the relevant parts of state
  const newBoard = state.board.map((sb) => [...sb]);
  const newStatuses = state.subBoardStatus.map((s) => ({ ...s })) as SubBoardStatus[];

  // Place the mark
  newBoard[subBoard][cell] = state.currentPlayer;

  // Check sub-board win/draw
  const sbWinner = checkBoardWin(newBoard[subBoard]);
  if (sbWinner !== null) {
    newStatuses[subBoard] = { result: 'won', winner: sbWinner };
  } else if (checkBoardDraw(newBoard[subBoard])) {
    newStatuses[subBoard] = { result: 'draw' };
  }

  // Check meta-board win/draw
  let gameOutcome = state.gameOutcome;
  const metaWinner = checkMetaBoardWin(newStatuses);
  if (metaWinner !== null) {
    gameOutcome = { result: 'win', winner: metaWinner };
  } else if (checkMetaBoardDraw(newStatuses)) {
    gameOutcome = { result: 'draw' };
  }

  // Determine next active sub-board via send rule
  let nextActive: SubBoardIndex | null = cell as SubBoardIndex;
  // If the target sub-board is resolved, grant a free move
  if (newStatuses[nextActive].result !== 'playing') {
    nextActive = null;
  }

  const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';

  return {
    board: newBoard,
    subBoardStatus: newStatuses,
    currentPlayer: nextPlayer,
    activeSubBoard: gameOutcome !== null ? null : nextActive,
    lastMove: { subBoard, cell },
    gameOutcome,
    moveCount: state.moveCount + 1,
    moveHistory: [...state.moveHistory, { subBoard, cell }],
  };
}

/**
 * Find the winning line on the meta-board, if any.
 * Returns the indices of the 3 winning sub-boards, or null.
 */
export function getWinningLine(statuses: SubBoardStatus[]): readonly [number, number, number] | null {
  const metaCells: CellValue[] = statuses.map((s) =>
    s.result === 'won' ? s.winner : null,
  );
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    const v = metaCells[a];
    if (v !== null && v === metaCells[b] && v === metaCells[c]) {
      return pattern;
    }
  }
  return null;
}
