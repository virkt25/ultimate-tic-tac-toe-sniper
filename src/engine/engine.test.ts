import { describe, it, expect } from 'vitest';
import type { CellValue, GameState, SubBoardIndex } from './types';

import {
  createInitialState,
  makeMove,
  isValidMove,
  getValidMoves,
  checkSubBoardWin,
  checkMetaBoardWin,
} from './engine';

describe('createInitialState', () => {
  it('should create a valid initial state', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('X');
    expect(state.activeSubBoard).toBeNull();
    expect(state.lastMove).toBeNull();
    expect(state.gameOutcome).toBeNull();
    expect(state.moveCount).toBe(0);
    expect(state.board).toHaveLength(9);
    expect(state.board[0]).toHaveLength(9);
    expect(state.board.every((sb) => sb.every((c) => c === null))).toBe(true);
    expect(state.subBoardStatus.every((s) => s.result === 'playing')).toBe(true);
  });
});

describe('basic moves', () => {
  it('should place a mark and switch player', () => {
    const state = createInitialState();
    const next = makeMove(state, 0, 4);
    expect(next.board[0][4]).toBe('X');
    expect(next.currentPlayer).toBe('O');
    expect(next.moveCount).toBe(1);
    expect(next.lastMove).toEqual({ subBoard: 0, cell: 4 });
  });

  it('should apply the send rule: playing in cell N sends opponent to sub-board N', () => {
    const state = createInitialState();
    const next = makeMove(state, 0, 4);
    // Played cell 4 → activeSubBoard should be 4
    expect(next.activeSubBoard).toBe(4);
  });

  it('should enforce sub-board constraint', () => {
    const state = createInitialState();
    const s1 = makeMove(state, 0, 4); // X plays, sends to 4
    // O must play in sub-board 4
    expect(isValidMove(s1, 0, 0)).toBe(false);
    expect(isValidMove(s1, 4, 0)).toBe(true);
  });
});

describe('send rule', () => {
  it('first move is free (any sub-board)', () => {
    const state = createInitialState();
    expect(state.activeSubBoard).toBeNull();
    // Should be able to play in any sub-board
    for (let sb = 0; sb < 9; sb++) {
      expect(isValidMove(state, sb as SubBoardIndex, 0)).toBe(true);
    }
  });

  it('free move when sent to a won sub-board', () => {
    // Win sub-board 4 for X, then send opponent to sub-board 4
    let state = createInitialState();
    // X wins sub-board 4 (cells 0, 1, 2): X plays 4-0, O plays 0-x, X plays 4-1, O plays 1-x, X plays 4-2
    state = makeMove(state, 4, 0); // X → sub-board 4, cell 0, sends to 0
    state = makeMove(state, 0, 4); // O → sub-board 0, cell 4, sends to 4
    state = makeMove(state, 4, 1); // X → sub-board 4, cell 1, sends to 1
    state = makeMove(state, 1, 4); // O → sub-board 1, cell 4, sends to 4
    state = makeMove(state, 4, 2); // X → sub-board 4, cell 2, wins sub-board 4, sends to 2

    expect(state.subBoardStatus[4]).toEqual({ result: 'won', winner: 'X' });
    // X played cell 2 → next activeSubBoard = 2 (sub-board 2 is still playing)
    expect(state.activeSubBoard).toBe(2);

    // Now O plays in sub-board 2, cell 4 → sends to sub-board 4 (which is won)
    state = makeMove(state, 2, 4); // O → sub-board 2, cell 4, sends to 4 (won) → free move
    expect(state.activeSubBoard).toBeNull();
  });

  it('free move when sent to a drawn sub-board', () => {
    let state = createInitialState();
    // Fill sub-board 0 to a draw:
    // X O X    0 1 2
    // X X O    3 4 5
    // O X O    6 7 8
    // Moves need to interleave with other boards due to send rule

    // We need to carefully orchestrate moves to fill sub-board 0 as a draw
    // Let's use a simpler approach: manually set up the state
    const board = createInitialState().board.map((sb) => [...sb]);
    board[0] = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'] as CellValue[];

    state = {
      ...createInitialState(),
      board,
      subBoardStatus: createInitialState().subBoardStatus.map((s, i) =>
        i === 0 ? { result: 'draw' as const } : s,
      ),
      currentPlayer: 'X',
      activeSubBoard: null,
      moveCount: 9,
    };

    // Now play a move that sends to sub-board 0 (drawn)
    state = makeMove(state, 1, 0); // X plays sub-board 1, cell 0 → sends to 0 (drawn) → free move
    expect(state.activeSubBoard).toBeNull();
  });
});

describe('checkSubBoardWin', () => {
  it('detects row wins', () => {
    expect(checkSubBoardWin(['X', 'X', 'X', null, null, null, null, null, null])).toBe('X');
    expect(checkSubBoardWin([null, null, null, 'O', 'O', 'O', null, null, null])).toBe('O');
    expect(checkSubBoardWin([null, null, null, null, null, null, 'X', 'X', 'X'])).toBe('X');
  });

  it('detects column wins', () => {
    expect(checkSubBoardWin(['X', null, null, 'X', null, null, 'X', null, null])).toBe('X');
    expect(checkSubBoardWin([null, 'O', null, null, 'O', null, null, 'O', null])).toBe('O');
    expect(checkSubBoardWin([null, null, 'X', null, null, 'X', null, null, 'X'])).toBe('X');
  });

  it('detects diagonal wins', () => {
    expect(checkSubBoardWin(['X', null, null, null, 'X', null, null, null, 'X'])).toBe('X');
    expect(checkSubBoardWin([null, null, 'O', null, 'O', null, 'O', null, null])).toBe('O');
  });

  it('returns null for no winner', () => {
    expect(checkSubBoardWin(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'])).toBeNull();
    expect(checkSubBoardWin([null, null, null, null, null, null, null, null, null])).toBeNull();
  });
});

describe('checkMetaBoardWin', () => {
  it('detects a row win on the meta-board', () => {
    const statuses = createInitialState().subBoardStatus.map((_, i) =>
      i < 3 ? { result: 'won' as const, winner: 'X' as const } : { result: 'playing' as const },
    );
    expect(checkMetaBoardWin(statuses)).toBe('X');
  });

  it('drawn sub-boards count for neither player', () => {
    const statuses = createInitialState().subBoardStatus.map((_, i) => {
      if (i === 0) return { result: 'won' as const, winner: 'X' as const };
      if (i === 1) return { result: 'draw' as const };
      if (i === 2) return { result: 'won' as const, winner: 'X' as const };
      return { result: 'playing' as const };
    });
    // X won 0 and 2, but 1 is draw → no row win
    expect(checkMetaBoardWin(statuses)).toBeNull();
  });
});

describe('invalid moves', () => {
  it('rejects move to occupied cell', () => {
    const state = createInitialState();
    const s1 = makeMove(state, 0, 0); // X plays 0,0
    // Try to play same cell
    expect(isValidMove(s1, 0, 0)).toBe(false);
    const s2 = makeMove(s1, 0, 0);
    expect(s2).toBe(s1); // unchanged
  });

  it('rejects move to wrong sub-board', () => {
    const state = createInitialState();
    const s1 = makeMove(state, 0, 4); // sends to 4
    expect(isValidMove(s1, 0, 1)).toBe(false); // wrong sub-board
  });

  it('rejects move to won sub-board', () => {
    let state = createInitialState();
    state = makeMove(state, 4, 0); // X
    state = makeMove(state, 0, 4); // O
    state = makeMove(state, 4, 1); // X
    state = makeMove(state, 1, 4); // O
    state = makeMove(state, 4, 2); // X wins sub-board 4

    expect(state.subBoardStatus[4].result).toBe('won');
    expect(isValidMove(state, 4, 3)).toBe(false);
  });

  it('rejects move after game over', () => {
    // Build a state where the game is won
    const state: GameState = {
      ...createInitialState(),
      gameOutcome: { result: 'win', winner: 'X' },
    };
    expect(isValidMove(state, 0, 0)).toBe(false);
  });
});

describe('sub-board draws', () => {
  it('detects a sub-board draw when all cells filled with no winner', () => {
    let state = createInitialState();
    // Fill sub-board 0 to a draw through valid game moves
    // We'll construct a state manually for this test
    const board = createInitialState().board.map((sb) => [...sb]);
    // X O X
    // O X O
    // O X _  (one cell left, about to become draw with O)
    board[0] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null] as CellValue[];

    state = {
      ...createInitialState(),
      board,
      currentPlayer: 'O',
      activeSubBoard: 0,
      moveCount: 8,
    };

    const next = makeMove(state, 0, 8);
    // X O X / O X O / O X O → no winner, board full → draw
    expect(next.subBoardStatus[0]).toEqual({ result: 'draw' });
  });
});

describe('edge cases', () => {
  it('move that simultaneously wins sub-board AND meta-board', () => {
    // Set up: X has won sub-boards 0 and 1, about to win sub-board 2
    const board = createInitialState().board.map((sb) => [...sb]);
    board[2] = ['X', 'X', null, null, null, null, null, null, null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      board,
      subBoardStatus: [
        { result: 'won', winner: 'X' },
        { result: 'won', winner: 'X' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
      ],
      currentPlayer: 'X',
      activeSubBoard: 2,
      moveCount: 20,
    };

    const next = makeMove(state, 2, 2);
    expect(next.subBoardStatus[2]).toEqual({ result: 'won', winner: 'X' });
    expect(next.gameOutcome).toEqual({ result: 'win', winner: 'X' });
  });

  it('move wins sub-board, send target is the just-won board -> free move', () => {
    // X about to win sub-board 3 by playing cell 3 → sends to 3 (just won) → free move
    const board = createInitialState().board.map((sb) => [...sb]);
    board[3] = ['X', 'X', null, null, null, null, 'X', null, null] as CellValue[];
    // Win pattern: column 0 → cells 0, 3, 6. Cell 3 is the move.

    const state: GameState = {
      ...createInitialState(),
      board,
      currentPlayer: 'X',
      activeSubBoard: 3,
      moveCount: 10,
    };

    const next = makeMove(state, 3, 3);
    expect(next.subBoardStatus[3]).toEqual({ result: 'won', winner: 'X' });
    // Sent to sub-board 3 which is now won → free move
    expect(next.activeSubBoard).toBeNull();
  });
});

describe('getValidMoves', () => {
  it('returns 81 moves for initial state', () => {
    const state = createInitialState();
    expect(getValidMoves(state)).toHaveLength(81);
  });

  it('returns only moves in the active sub-board', () => {
    const state = makeMove(createInitialState(), 0, 4); // sends to 4
    const moves = getValidMoves(state);
    expect(moves.every((m) => m.subBoard === 4)).toBe(true);
    expect(moves).toHaveLength(9);
  });

  it('returns empty array when game is over', () => {
    const state: GameState = {
      ...createInitialState(),
      gameOutcome: { result: 'win', winner: 'X' },
    };
    expect(getValidMoves(state)).toHaveLength(0);
  });
});

describe('full game sequences', () => {
  it('plays a full game ending in a win using constructed state', () => {
    // Set up a state where X has won sub-boards 0, 3 (column 0 pattern: 0,3,6)
    // and is about to win sub-board 6
    const board = createInitialState().board.map((sb) => [...sb]);
    board[6] = ['X', 'X', null, null, null, null, null, null, null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      board,
      subBoardStatus: [
        { result: 'won', winner: 'X' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'won', winner: 'X' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
        { result: 'playing' },
      ],
      currentPlayer: 'X',
      activeSubBoard: 6,
      moveCount: 30,
    };

    const next = makeMove(state, 6, 2); // X wins sub-board 6, completing column 0
    expect(next.subBoardStatus[6]).toEqual({ result: 'won', winner: 'X' });
    expect(next.gameOutcome).toEqual({ result: 'win', winner: 'X' });
    expect(getValidMoves(next)).toHaveLength(0);
  });

  it('detects a meta-board draw when all sub-boards are resolved', () => {
    // Construct a state where all sub-boards are resolved with no meta winner
    const state: GameState = {
      ...createInitialState(),
      subBoardStatus: [
        { result: 'won', winner: 'X' },
        { result: 'won', winner: 'O' },
        { result: 'won', winner: 'X' },
        { result: 'won', winner: 'O' },
        { result: 'won', winner: 'X' },
        { result: 'won', winner: 'O' },
        { result: 'won', winner: 'O' },
        { result: 'won', winner: 'X' },
        { result: 'playing' }, // about to draw
      ],
      board: createInitialState().board.map((sb, i) => {
        if (i === 8) {
          return ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null] as CellValue[];
        }
        return sb;
      }),
      currentPlayer: 'O',
      activeSubBoard: 8,
      moveCount: 72,
    };

    // Verify no meta winner yet
    // X: 0,2,4,7 → no three in a row
    // O: 1,3,5,6 → no three in a row
    expect(checkMetaBoardWin(state.subBoardStatus)).toBeNull();

    const next = makeMove(state, 8, 8); // O fills last cell of sb8
    // sb8: X O X / O X O / O X O → no winner → draw
    expect(next.subBoardStatus[8]).toEqual({ result: 'draw' });
    expect(next.gameOutcome).toEqual({ result: 'draw' });
  });
});
