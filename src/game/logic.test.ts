import { describe, it, expect } from 'vitest';
import type { CellValue, GameState } from './types';
import { createInitialState, WIN_LINES } from './constants';
import {
  validateMove,
  checkBoardResult,
  checkGameResult,
  getNextActiveBoard,
} from './logic';

describe('validateMove', () => {
  it('allows a move on an empty cell in a valid board', () => {
    const state = createInitialState();
    expect(validateMove(state, 0, 0)).toBe(true);
  });

  it('allows any board when activeBoardIndex is null (free move)', () => {
    const state = createInitialState();
    for (let b = 0; b < 9; b++) {
      expect(validateMove(state, b, 0)).toBe(true);
    }
  });

  it('rejects move on wrong board when activeBoardIndex is set', () => {
    const state: GameState = {
      ...createInitialState(),
      activeBoardIndex: 4,
    };
    expect(validateMove(state, 0, 0)).toBe(false);
    expect(validateMove(state, 4, 0)).toBe(true);
  });

  it('rejects move on occupied cell', () => {
    const state = createInitialState();
    state.boards[0][0] = 'X';
    expect(validateMove(state, 0, 0)).toBe(false);
  });

  it('rejects move on a decided board', () => {
    const state: GameState = {
      ...createInitialState(),
      boardResults: ['X', null, null, null, null, null, null, null, null],
    };
    expect(validateMove(state, 0, 5)).toBe(false);
  });

  it('rejects move when game has a winner', () => {
    const state: GameState = {
      ...createInitialState(),
      winner: 'X',
    };
    expect(validateMove(state, 0, 0)).toBe(false);
  });

  it('rejects move when game is a draw', () => {
    const state: GameState = {
      ...createInitialState(),
      isDraw: true,
    };
    expect(validateMove(state, 0, 0)).toBe(false);
  });
});

describe('checkBoardResult', () => {
  it('detects row wins', () => {
    expect(checkBoardResult(['X', 'X', 'X', null, null, null, null, null, null])).toBe('X');
    expect(checkBoardResult([null, null, null, 'O', 'O', 'O', null, null, null])).toBe('O');
    expect(checkBoardResult([null, null, null, null, null, null, 'X', 'X', 'X'])).toBe('X');
  });

  it('detects column wins', () => {
    expect(checkBoardResult(['X', null, null, 'X', null, null, 'X', null, null])).toBe('X');
    expect(checkBoardResult([null, 'O', null, null, 'O', null, null, 'O', null])).toBe('O');
    expect(checkBoardResult([null, null, 'X', null, null, 'X', null, null, 'X'])).toBe('X');
  });

  it('detects diagonal wins', () => {
    expect(checkBoardResult(['X', null, null, null, 'X', null, null, null, 'X'])).toBe('X');
    expect(checkBoardResult([null, null, 'O', null, 'O', null, 'O', null, null])).toBe('O');
  });

  it('detects a draw when board is full with no winner', () => {
    const draw: CellValue[] = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'];
    expect(checkBoardResult(draw)).toBe('draw');
  });

  it('returns null for an in-progress board', () => {
    expect(checkBoardResult([null, null, null, null, null, null, null, null, null])).toBeNull();
    expect(checkBoardResult(['X', 'O', null, null, null, null, null, null, null])).toBeNull();
  });

  it('returns null for partially filled board with no winner', () => {
    const partial: CellValue[] = ['X', 'O', 'X', 'O', null, null, null, null, null];
    expect(checkBoardResult(partial)).toBeNull();
  });
});

describe('checkGameResult', () => {
  it('detects a meta-game win via row', () => {
    const results = [null, null, null, null, null, null, null, null, null] as GameState['boardResults'];
    results[0] = 'X';
    results[1] = 'X';
    results[2] = 'X';
    expect(checkGameResult(results)).toEqual({ winner: 'X', isDraw: false });
  });

  it('detects a meta-game win via column', () => {
    const results = [null, null, null, null, null, null, null, null, null] as GameState['boardResults'];
    results[0] = 'O';
    results[3] = 'O';
    results[6] = 'O';
    expect(checkGameResult(results)).toEqual({ winner: 'O', isDraw: false });
  });

  it('detects a meta-game win via diagonal', () => {
    const results = [null, null, null, null, null, null, null, null, null] as GameState['boardResults'];
    results[0] = 'X';
    results[4] = 'X';
    results[8] = 'X';
    expect(checkGameResult(results)).toEqual({ winner: 'X', isDraw: false });
  });

  it('detects a meta-game draw when all 9 boards decided and no winner', () => {
    // X O X / O X O / O X O — no three in a row
    const results: GameState['boardResults'] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'draw'];
    expect(checkGameResult(results)).toEqual({ winner: null, isDraw: true });
  });

  it('does not count draw boards toward a win line', () => {
    const results: GameState['boardResults'] = ['X', 'draw', 'X', null, null, null, null, null, null];
    expect(checkGameResult(results)).toEqual({ winner: null, isDraw: false });
  });

  it('returns no winner and no draw when game is in progress', () => {
    const results: GameState['boardResults'] = ['X', null, null, null, null, null, null, null, null];
    expect(checkGameResult(results)).toEqual({ winner: null, isDraw: false });
  });
});

describe('getNextActiveBoard', () => {
  it('returns cellIndex when target board is undecided', () => {
    const results: GameState['boardResults'] = Array(9).fill(null);
    expect(getNextActiveBoard(4, results)).toBe(4);
  });

  it('returns null (free move) when target board is won', () => {
    const results: GameState['boardResults'] = [null, null, null, null, 'X', null, null, null, null];
    expect(getNextActiveBoard(4, results)).toBeNull();
  });

  it('returns null (free move) when target board is drawn', () => {
    const results: GameState['boardResults'] = [null, null, null, null, 'draw', null, null, null, null];
    expect(getNextActiveBoard(4, results)).toBeNull();
  });
});

describe('WIN_LINES', () => {
  it('has exactly 8 winning lines', () => {
    expect(WIN_LINES).toHaveLength(8);
  });

  it('each line contains 3 indices from 0 to 8', () => {
    for (const line of WIN_LINES) {
      expect(line).toHaveLength(3);
      for (const idx of line) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(8);
      }
    }
  });
});
