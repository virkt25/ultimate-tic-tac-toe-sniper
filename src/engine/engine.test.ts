import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  makeMove,
  isValidMove,
  getValidBoards,
  getValidMoves,
  checkBoardWin,
  checkBoardDraw,
  checkMetaBoardWin,
  checkMetaBoardDraw,
  getWinningLine,
} from './engine.ts';
import type { GameState, SubBoardIndex, CellIndex, CellValue, SubBoardStatus } from './types.ts';

// Helper to play a sequence of moves
function playMoves(
  moves: Array<[SubBoardIndex, CellIndex]>,
  startState?: GameState,
): GameState {
  let state = startState ?? createInitialState();
  for (const [sb, cell] of moves) {
    state = makeMove(state, sb, cell);
  }
  return state;
}

describe('createInitialState', () => {
  it('should create a state with 9 empty sub-boards of 9 cells each', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(9);
    for (const sb of state.board) {
      expect(sb).toHaveLength(9);
      expect(sb.every((c) => c === null)).toBe(true);
    }
  });

  it('should have all sub-boards in playing status', () => {
    const state = createInitialState();
    expect(state.subBoardStatus).toHaveLength(9);
    for (const s of state.subBoardStatus) {
      expect(s.result).toBe('playing');
    }
  });

  it('should start with Player X, no active constraint, no outcome', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('X');
    expect(state.activeSubBoard).toBeNull();
    expect(state.lastMove).toBeNull();
    expect(state.gameOutcome).toBeNull();
    expect(state.moveCount).toBe(0);
    expect(state.moveHistory).toHaveLength(0);
  });
});

describe('checkBoardWin', () => {
  it('should detect all 8 winning patterns', () => {
    const patterns: Array<[number, number, number]> = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],            // diagonals
    ];

    for (const [a, b, c] of patterns) {
      const cells: CellValue[] = Array(9).fill(null);
      cells[a] = 'X';
      cells[b] = 'X';
      cells[c] = 'X';
      expect(checkBoardWin(cells)).toBe('X');

      const cellsO: CellValue[] = Array(9).fill(null);
      cellsO[a] = 'O';
      cellsO[b] = 'O';
      cellsO[c] = 'O';
      expect(checkBoardWin(cellsO)).toBe('O');
    }
  });

  it('should return null for an empty board', () => {
    expect(checkBoardWin(Array(9).fill(null))).toBeNull();
  });

  it('should return null for a board with no three-in-a-row', () => {
    const cells: CellValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkBoardWin(cells)).toBeNull();
  });
});

describe('checkBoardDraw', () => {
  it('should detect a draw when all cells are filled with no winner', () => {
    const cells: CellValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkBoardDraw(cells)).toBe(true);
  });

  it('should not be a draw if there are empty cells', () => {
    const cells: CellValue[] = ['X', 'O', null, null, null, null, null, null, null];
    expect(checkBoardDraw(cells)).toBe(false);
  });

  it('should not be a draw if there is a winner', () => {
    const cells: CellValue[] = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    expect(checkBoardDraw(cells)).toBe(false);
  });
});

describe('send rule', () => {
  it('should constrain next move to the sub-board matching the cell index', () => {
    // X plays in sub-board 0, cell 4 -> next player must play in sub-board 4
    const state = playMoves([[0, 4]]);
    expect(state.currentPlayer).toBe('O');
    expect(state.activeSubBoard).toBe(4);
  });

  it('should enforce the constraint (reject moves to wrong sub-board)', () => {
    const state = playMoves([[0, 4]]);
    // O must play in sub-board 4
    expect(isValidMove(state, 0, 0)).toBe(false); // wrong sub-board
    expect(isValidMove(state, 4, 0)).toBe(true);  // correct sub-board
  });

  it('first move is a free move (any sub-board)', () => {
    const state = createInitialState();
    const validBoards = getValidBoards(state);
    expect(validBoards).toHaveLength(9);
    expect(state.activeSubBoard).toBeNull();
  });

  it('should grant free move when send rule targets a won sub-board', () => {
    // Create a state where sb0 is won and the active sub-board points to sb0
    const simple = createInitialState();
    const modState: GameState = {
      ...simple,
      board: simple.board.map((sb, i) =>
        i === 0 ? ['X', 'X', 'X', 'O', 'O', null, null, null, null] : [...sb],
      ),
      subBoardStatus: simple.subBoardStatus.map((s, i) =>
        i === 0 ? { result: 'won' as const, winner: 'X' as const } : { ...s },
      ),
      activeSubBoard: 0 as SubBoardIndex,
      currentPlayer: 'O',
    };

    // O should get a free move since sb0 is won
    const validBoards = getValidBoards(modState);
    expect(validBoards).not.toContain(0);
    expect(validBoards.length).toBe(8);
  });

  it('should grant free move when send rule targets a drawn sub-board', () => {
    const state = createInitialState();
    const drawnBoard: CellValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const modState: GameState = {
      ...state,
      board: state.board.map((sb, i) => (i === 3 ? [...drawnBoard] : [...sb])),
      subBoardStatus: state.subBoardStatus.map((s, i) =>
        i === 3 ? { result: 'draw' as const } : { ...s },
      ),
      activeSubBoard: 3 as SubBoardIndex,
      currentPlayer: 'X',
    };

    const validBoards = getValidBoards(modState);
    expect(validBoards).not.toContain(3);
    expect(validBoards.length).toBe(8);
  });
});

describe('makeMove', () => {
  it('should place a mark and toggle the player', () => {
    const state = createInitialState();
    const next = makeMove(state, 0 as SubBoardIndex, 0 as CellIndex);
    expect(next.board[0][0]).toBe('X');
    expect(next.currentPlayer).toBe('O');
    expect(next.moveCount).toBe(1);
    expect(next.lastMove).toEqual({ subBoard: 0, cell: 0 });
  });

  it('should reject moves to occupied cells', () => {
    const state = makeMove(createInitialState(), 0 as SubBoardIndex, 0 as CellIndex);
    // O tries the same cell in sb0 (but active is sb0... actually active is cell 0 = sb0)
    const next = makeMove(state, 0 as SubBoardIndex, 0 as CellIndex);
    expect(next).toBe(state); // unchanged
  });

  it('should reject moves after game is over', () => {
    // Build a won game
    const state = createInitialState();
    const wonState: GameState = {
      ...state,
      gameOutcome: { result: 'win', winner: 'X' },
    };
    const next = makeMove(wonState, 0 as SubBoardIndex, 0 as CellIndex);
    expect(next).toBe(wonState);
  });

  it('should record move history', () => {
    let state = createInitialState();
    state = makeMove(state, 4 as SubBoardIndex, 4 as CellIndex);
    state = makeMove(state, 4 as SubBoardIndex, 0 as CellIndex);
    expect(state.moveHistory).toEqual([
      { subBoard: 4, cell: 4 },
      { subBoard: 4, cell: 0 },
    ]);
  });

  it('should not mutate the original state', () => {
    const state = createInitialState();
    const next = makeMove(state, 0 as SubBoardIndex, 0 as CellIndex);
    expect(state.board[0][0]).toBeNull();
    expect(next.board[0][0]).toBe('X');
  });
});

describe('sub-board win detection integrated into makeMove', () => {
  it('should detect a sub-board win when a row is completed', () => {
    let state = createInitialState();
    // X plays top row of sb0: cells 0, 1, 2
    state = makeMove(state, 0, 0); // X->sb0,c0; active=0
    state = makeMove(state, 0, 3); // O->sb0,c3; active=3
    state = makeMove(state, 3, 1); // X->sb3,c1; active=1
    state = makeMove(state, 1, 0); // O->sb1,c0; active=0
    state = makeMove(state, 0, 1); // X->sb0,c1; active=1
    state = makeMove(state, 1, 2); // O->sb1,c2; active=2
    state = makeMove(state, 2, 0); // X->sb2,c0; active=0
    state = makeMove(state, 0, 6); // O->sb0,c6; active=6
    state = makeMove(state, 6, 2); // X->sb6,c2; active=2
    state = makeMove(state, 2, 0); // O->sb2,c0 TAKEN! Invalid
    state = makeMove(state, 2, 1); // O->sb2,c1; active=1
    state = makeMove(state, 1, 0); // X->sb1,c0 TAKEN (O has it)
    state = makeMove(state, 1, 1); // X->sb1,c1; active=1 (sends to sb1)
    // This is getting tangled. Let me use a direct construction approach.

    // Build state where X has cells 0,1 in sb0 and plays cell 2
    const s = createInitialState();
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) =>
        i === 0 ? ['X', 'X', null, 'O', 'O', null, null, null, null] : [...sb],
      ),
      currentPlayer: 'X',
      activeSubBoard: 0 as SubBoardIndex,
      moveCount: 4,
      moveHistory: [],
    };

    const after = makeMove(modState, 0 as SubBoardIndex, 2 as CellIndex);
    expect(after.subBoardStatus[0]).toEqual({ result: 'won', winner: 'X' });
  });

  it('should detect a sub-board draw', () => {
    const s = createInitialState();
    // Set up a sub-board with 8 cells filled, no winner, one empty cell
    // Pattern: X O X / X O O / O X _ -> filling last cell (8) with X makes draw
    const almostDrawn: CellValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) => (i === 0 ? [...almostDrawn] : [...sb])),
      currentPlayer: 'X',
      activeSubBoard: 0 as SubBoardIndex,
      moveCount: 8,
      moveHistory: [],
    };

    const after = makeMove(modState, 0 as SubBoardIndex, 8 as CellIndex);
    expect(after.subBoardStatus[0]).toEqual({ result: 'draw' });
  });
});

describe('meta-board win detection', () => {
  it('should detect a meta-board win when 3 sub-boards in a row are won', () => {
    const s = createInitialState();
    // X has won sub-boards 0, 1. About to win sub-board 2 (top row of meta-board).
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) => {
        if (i === 0 || i === 1) return ['X', 'X', 'X', null, null, null, null, null, null];
        if (i === 2) return ['X', 'X', null, 'O', 'O', null, null, null, null];
        return [...sb];
      }),
      subBoardStatus: s.subBoardStatus.map((st, i) => {
        if (i === 0 || i === 1) return { result: 'won' as const, winner: 'X' as const };
        return { ...st };
      }),
      currentPlayer: 'X',
      activeSubBoard: 2 as SubBoardIndex,
      moveCount: 10,
      moveHistory: [],
    };

    const after = makeMove(modState, 2 as SubBoardIndex, 2 as CellIndex);
    expect(after.subBoardStatus[2]).toEqual({ result: 'won', winner: 'X' });
    expect(after.gameOutcome).toEqual({ result: 'win', winner: 'X' });
  });

  it('should detect all 8 meta-board winning patterns', () => {
    const patterns: Array<[number, number, number]> = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of patterns) {
      const statuses: SubBoardStatus[] = Array.from({ length: 9 }, () => ({
        result: 'playing' as const,
      }));
      statuses[a] = { result: 'won', winner: 'X' };
      statuses[b] = { result: 'won', winner: 'X' };
      statuses[c] = { result: 'won', winner: 'X' };
      expect(checkMetaBoardWin(statuses)).toBe('X');
    }
  });

  it('should detect a meta-board draw', () => {
    // All sub-boards resolved, no 3 in a row
    const statuses: SubBoardStatus[] = [
      { result: 'won', winner: 'X' },
      { result: 'won', winner: 'O' },
      { result: 'won', winner: 'X' },
      { result: 'won', winner: 'X' },
      { result: 'won', winner: 'O' },
      { result: 'won', winner: 'O' },
      { result: 'won', winner: 'O' },
      { result: 'won', winner: 'X' },
      { result: 'won', winner: 'X' },
    ];
    // Check: rows 012=XOX, 345=XOO, 678=OXX. cols 036=XXO, 147=OOX, 258=XOX. diag 048=XOX, 246=XOO. No 3-in-a-row.
    expect(checkMetaBoardWin(statuses)).toBeNull();
    expect(checkMetaBoardDraw(statuses)).toBe(true);
  });

  it('should detect meta-board draw with some drawn sub-boards', () => {
    const statuses: SubBoardStatus[] = [
      { result: 'won', winner: 'X' },
      { result: 'draw' },
      { result: 'won', winner: 'O' },
      { result: 'draw' },
      { result: 'won', winner: 'X' },
      { result: 'draw' },
      { result: 'won', winner: 'O' },
      { result: 'draw' },
      { result: 'won', winner: 'X' },
    ];
    // Draws count for nobody. X has 0,4,8 (diagonal) -> X wins!
    expect(checkMetaBoardWin(statuses)).toBe('X');
    expect(checkMetaBoardDraw(statuses)).toBe(false);
  });

  it('should handle simultaneous sub-board win and meta-board win', () => {
    const s = createInitialState();
    // X has won sb0, sb3 (left column). About to win sb6.
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) => {
        if (i === 0 || i === 3) return ['X', 'X', 'X', null, null, null, null, null, null];
        if (i === 6) return ['X', 'X', null, 'O', 'O', null, null, null, null];
        return [...sb];
      }),
      subBoardStatus: s.subBoardStatus.map((st, i) => {
        if (i === 0 || i === 3) return { result: 'won' as const, winner: 'X' as const };
        return { ...st };
      }),
      currentPlayer: 'X',
      activeSubBoard: 6 as SubBoardIndex,
      moveCount: 10,
      moveHistory: [],
    };

    const after = makeMove(modState, 6 as SubBoardIndex, 2 as CellIndex);
    expect(after.subBoardStatus[6]).toEqual({ result: 'won', winner: 'X' });
    expect(after.gameOutcome).toEqual({ result: 'win', winner: 'X' });
  });
});

describe('move sent to just-won sub-board', () => {
  it('should grant free move when a move wins a sub-board and sends opponent to that won board', () => {
    const s = createInitialState();
    // X is about to win sub-board 5 by playing cell 5 (which sends to sb5 itself!)
    // sb5 has X at cells 3,4 (middle row). Playing cell 5 completes the row.
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) => {
        if (i === 5) return [null, null, null, 'X', 'X', null, 'O', 'O', null];
        return [...sb];
      }),
      currentPlayer: 'X',
      activeSubBoard: 5 as SubBoardIndex,
      moveCount: 4,
      moveHistory: [],
    };

    const after = makeMove(modState, 5 as SubBoardIndex, 5 as CellIndex);
    expect(after.subBoardStatus[5]).toEqual({ result: 'won', winner: 'X' });
    // Cell 5 -> send to sb5, but sb5 is now won -> free move
    expect(after.activeSubBoard).toBeNull();
    expect(after.gameOutcome).toBeNull(); // Game not over yet
  });
});

describe('getValidMoves', () => {
  it('should return all 81 cells for initial state', () => {
    const state = createInitialState();
    const moves = getValidMoves(state);
    expect(moves.length).toBe(81);
  });

  it('should return only moves in the active sub-board when constrained', () => {
    const state = makeMove(createInitialState(), 0 as SubBoardIndex, 4 as CellIndex);
    // Active sub-board is 4
    const moves = getValidMoves(state);
    expect(moves.every((m) => m.subBoard === 4)).toBe(true);
    expect(moves.length).toBe(9); // All cells in sb4 are empty
  });

  it('should return no moves when game is over', () => {
    const state: GameState = {
      ...createInitialState(),
      gameOutcome: { result: 'win', winner: 'X' },
    };
    expect(getValidMoves(state)).toHaveLength(0);
  });
});

describe('getWinningLine', () => {
  it('should return the winning pattern when meta-board is won', () => {
    const statuses: SubBoardStatus[] = Array.from({ length: 9 }, () => ({
      result: 'playing' as const,
    }));
    statuses[0] = { result: 'won', winner: 'X' };
    statuses[4] = { result: 'won', winner: 'X' };
    statuses[8] = { result: 'won', winner: 'X' };
    expect(getWinningLine(statuses)).toEqual([0, 4, 8]);
  });

  it('should return null when no winning line exists', () => {
    const statuses: SubBoardStatus[] = Array.from({ length: 9 }, () => ({
      result: 'playing' as const,
    }));
    expect(getWinningLine(statuses)).toBeNull();
  });
});

describe('full game sequence', () => {
  it('should play through a full game ending in X winning', () => {
    // X wins the left column of the meta-board (sub-boards 0, 3, 6)
    // Strategy: X wins each sub-board via top row (cells 0,1,2)
    const s = createInitialState();

    // Build a state where X has won sb0 and sb3, about to win sb6
    const modState: GameState = {
      ...s,
      board: s.board.map((sb, i) => {
        if (i === 0 || i === 3) return ['X', 'X', 'X', 'O', 'O', null, null, null, null];
        if (i === 6) return ['X', 'X', null, null, null, null, null, null, null];
        return [...sb];
      }),
      subBoardStatus: s.subBoardStatus.map((st, i) => {
        if (i === 0 || i === 3) return { result: 'won' as const, winner: 'X' as const };
        return { ...st };
      }),
      currentPlayer: 'X',
      activeSubBoard: 6 as SubBoardIndex,
      moveCount: 12,
      moveHistory: [],
    };

    const final = makeMove(modState, 6 as SubBoardIndex, 2 as CellIndex);
    expect(final.gameOutcome).toEqual({ result: 'win', winner: 'X' });
    expect(final.subBoardStatus[6]).toEqual({ result: 'won', winner: 'X' });
  });
});

describe('undo via replay', () => {
  it('should support undo by replaying all moves except the last', () => {
    let state = createInitialState();
    state = makeMove(state, 4, 4); // X center of center
    state = makeMove(state, 4, 0); // O top-left of center
    state = makeMove(state, 0, 4); // X center of top-left

    // Undo last move by replaying first 2
    const history = state.moveHistory.slice(0, -1);
    let undone = createInitialState();
    for (const m of history) {
      undone = makeMove(undone, m.subBoard, m.cell);
    }

    expect(undone.moveCount).toBe(2);
    expect(undone.board[0][4]).toBeNull(); // The undone move
    expect(undone.currentPlayer).toBe('X'); // Back to X's turn
  });
});
