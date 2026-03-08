import type { CellIndex, CellValue, GameState, Player, SubBoardIndex, SubBoardStatus } from './types';
import { BOARD_SIZE, WIN_PATTERNS } from './constants';

export function createInitialState(): GameState {
  return {
    board: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null) as CellValue[]),
    subBoardStatus: Array.from({ length: BOARD_SIZE }, (): SubBoardStatus => ({ result: 'playing' })),
    currentPlayer: 'X',
    activeSubBoard: null,
    lastMove: null,
    gameOutcome: null,
    moveCount: 0,
  };
}

export function isValidMove(
  state: GameState,
  subBoard: SubBoardIndex,
  cell: CellIndex,
): boolean {
  // Game is over
  if (state.gameOutcome !== null) return false;

  // Sub-board already resolved
  if (state.subBoardStatus[subBoard].result !== 'playing') return false;

  // Cell already occupied
  if (state.board[subBoard][cell] !== null) return false;

  // Must play in activeSubBoard if set
  if (state.activeSubBoard !== null && state.activeSubBoard !== subBoard) return false;

  return true;
}

export function getValidMoves(
  state: GameState,
): Array<{ subBoard: SubBoardIndex; cell: CellIndex }> {
  const moves: Array<{ subBoard: SubBoardIndex; cell: CellIndex }> = [];

  for (let sb = 0; sb < BOARD_SIZE; sb++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const subBoard = sb as SubBoardIndex;
      const cell = c as CellIndex;
      if (isValidMove(state, subBoard, cell)) {
        moves.push({ subBoard, cell });
      }
    }
  }

  return moves;
}

export function checkSubBoardWin(cells: CellValue[]): Player | null {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (cells[a] !== null && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

export function checkMetaBoardWin(statuses: SubBoardStatus[]): Player | null {
  const metaCells: CellValue[] = statuses.map((s) =>
    s.result === 'won' ? s.winner : null,
  );
  return checkSubBoardWin(metaCells);
}

/**
 * Find which WIN_PATTERN was used to win, if any. Returns the pattern indices or null.
 */
export function findWinningPattern(statuses: SubBoardStatus[]): readonly [number, number, number] | null {
  const metaCells: CellValue[] = statuses.map((s) =>
    s.result === 'won' ? s.winner : null,
  );
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (metaCells[a] !== null && metaCells[a] === metaCells[b] && metaCells[b] === metaCells[c]) {
      return pattern;
    }
  }
  return null;
}

export function makeMove(
  state: GameState,
  subBoard: SubBoardIndex,
  cell: CellIndex,
): GameState {
  if (!isValidMove(state, subBoard, cell)) {
    return state;
  }

  // Clone board
  const newBoard = state.board.map((sb) => [...sb]);
  newBoard[subBoard][cell] = state.currentPlayer;

  // Clone sub-board statuses
  const newSubBoardStatus = [...state.subBoardStatus] as SubBoardStatus[];

  // Check if this move wins the sub-board
  const subBoardWinner = checkSubBoardWin(newBoard[subBoard]);
  if (subBoardWinner) {
    newSubBoardStatus[subBoard] = { result: 'won', winner: subBoardWinner };
  } else if (newBoard[subBoard].every((c) => c !== null)) {
    // Sub-board is full → draw
    newSubBoardStatus[subBoard] = { result: 'draw' };
  }

  // Check meta-board win
  const metaWinner = checkMetaBoardWin(newSubBoardStatus);
  let gameOutcome = state.gameOutcome;
  if (metaWinner) {
    gameOutcome = { result: 'win', winner: metaWinner };
  } else {
    // Check meta-board draw: all sub-boards resolved
    const allResolved = newSubBoardStatus.every((s) => s.result !== 'playing');
    if (allResolved) {
      gameOutcome = { result: 'draw' };
    }
  }

  // Determine next active sub-board (the "send" rule)
  let nextActiveSubBoard: SubBoardIndex | null = cell as SubBoardIndex;
  // If target sub-board is resolved, free move
  if (newSubBoardStatus[nextActiveSubBoard].result !== 'playing') {
    nextActiveSubBoard = null;
  }

  return {
    board: newBoard,
    subBoardStatus: newSubBoardStatus,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    activeSubBoard: gameOutcome ? null : nextActiveSubBoard,
    lastMove: { subBoard, cell },
    gameOutcome,
    moveCount: state.moveCount + 1,
  };
}
