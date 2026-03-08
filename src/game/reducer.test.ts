import { describe, it, expect } from 'vitest';
import type { CellValue, GameState } from './types';
import { createInitialState } from './constants';
import { gameReducer } from './reducer';

function play(state: GameState, boardIndex: number, cellIndex: number): GameState {
  return gameReducer(state, { type: 'PLAY_CELL', boardIndex, cellIndex });
}

describe('gameReducer — PLAY_CELL', () => {
  it('places a mark and toggles player', () => {
    const state = createInitialState();
    const next = play(state, 0, 4);
    expect(next.boards[0][4]).toBe('X');
    expect(next.currentPlayer).toBe('O');
  });

  it('applies the send rule: playing cell N sends opponent to board N', () => {
    const state = createInitialState();
    const next = play(state, 0, 4);
    expect(next.activeBoardIndex).toBe(4);
  });

  it('enforces active board constraint', () => {
    const s1 = play(createInitialState(), 0, 4); // sends to board 4
    // Trying to play on board 0 should be rejected (returns same state)
    const s2 = play(s1, 0, 1);
    expect(s2).toBe(s1);
  });

  it('rejects move on occupied cell', () => {
    const s1 = play(createInitialState(), 0, 0); // X plays (0,0), sends to 0
    const s2 = play(s1, 0, 0); // try same cell
    expect(s2).toBe(s1);
  });

  it('rejects move on decided board', () => {
    // Win board 4 for X
    let state = createInitialState();
    state = play(state, 4, 0); // X -> board 4 cell 0, sends to 0
    state = play(state, 0, 4); // O -> board 0 cell 4, sends to 4
    state = play(state, 4, 1); // X -> board 4 cell 1, sends to 1
    state = play(state, 1, 4); // O -> board 1 cell 4, sends to 4
    state = play(state, 4, 2); // X -> board 4 cell 2, wins board 4, sends to 2

    expect(state.boardResults[4]).toBe('X');

    // Now try to play on decided board 4 (via free move scenario)
    const stateWithFreeMove: GameState = { ...state, activeBoardIndex: null };
    const rejected = play(stateWithFreeMove, 4, 5);
    expect(rejected).toBe(stateWithFreeMove);
  });

  it('rejects move after game is won', () => {
    const state: GameState = {
      ...createInitialState(),
      winner: 'X',
    };
    const next = play(state, 0, 0);
    expect(next).toBe(state);
  });

  it('detects a small board win', () => {
    let state = createInitialState();
    // X wins board 0 with top row (cells 0, 1, 2)
    state = play(state, 0, 0); // X -> (0,0) sends to 0
    state = play(state, 0, 3); // O -> (0,3) sends to 3
    state = play(state, 3, 1); // X -> (3,1) sends to 1
    state = play(state, 1, 0); // O -> (1,0) sends to 0
    state = play(state, 0, 1); // X -> (0,1) sends to 1
    state = play(state, 1, 2); // O -> (1,2) sends to 2
    state = play(state, 2, 0); // X -> (2,0) sends to 0
    state = play(state, 0, 6); // O -> (0,6) sends to 6
    state = play(state, 6, 0); // X -> (6,0) sends to 0
    state = play(state, 0, 7); // O -> (0,7) sends to 7
    state = play(state, 7, 0); // X -> (7,0) sends to 0
    state = play(state, 0, 2); // O -> (0,2) completes row? No, let me reconsider.

    // Actually let me use a simpler approach - construct a near-win state
    const boards = createInitialState().boards.map((b) => [...b]);
    boards[0] = ['X', 'X', null, 'O', 'O', null, null, null, null] as CellValue[];

    const nearWin: GameState = {
      ...createInitialState(),
      boards,
      activeBoardIndex: 0,
      currentPlayer: 'X',
    };

    const won = play(nearWin, 0, 2); // X completes top row
    expect(won.boardResults[0]).toBe('X');
  });

  it('detects a small board draw', () => {
    const boards = createInitialState().boards.map((b) => [...b]);
    // X O X / O X O / O X _ — no winner yet, one cell left
    boards[0] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      boards,
      activeBoardIndex: 0,
      currentPlayer: 'O',
    };

    const drawn = play(state, 0, 8);
    expect(drawn.boardResults[0]).toBe('draw');
  });

  it('activates free move when sent to a decided board', () => {
    // Win board 4 for X, then send opponent there
    let state = createInitialState();
    state = play(state, 4, 0); // X
    state = play(state, 0, 4); // O sends to 4
    state = play(state, 4, 1); // X
    state = play(state, 1, 4); // O sends to 4
    state = play(state, 4, 2); // X wins board 4, sends to 2

    expect(state.boardResults[4]).toBe('X');
    expect(state.activeBoardIndex).toBe(2);

    // O plays in board 2, cell 4 -> sends to 4 (won) -> free move
    state = play(state, 2, 4);
    expect(state.activeBoardIndex).toBeNull();
  });

  it('detects meta-game win', () => {
    const boards = createInitialState().boards.map((b) => [...b]);
    boards[2] = ['X', 'X', null, null, null, null, null, null, null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      boards,
      boardResults: ['X', 'X', null, null, null, null, null, null, null],
      activeBoardIndex: 2,
      currentPlayer: 'X',
    };

    const won = play(state, 2, 2); // X wins board 2 -> top row meta win
    expect(won.boardResults[2]).toBe('X');
    expect(won.winner).toBe('X');
    expect(won.isDraw).toBe(false);
    expect(won.activeBoardIndex).toBeNull();
  });

  it('detects meta-game draw', () => {
    // Pattern: X O X / O X O / O X _ (board 8 about to draw)
    const boards = createInitialState().boards.map((b) => [...b]);
    boards[8] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      boards,
      boardResults: ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null],
      activeBoardIndex: 8,
      currentPlayer: 'O',
    };

    const drawn = play(state, 8, 8);
    expect(drawn.boardResults[8]).toBe('draw');
    expect(drawn.winner).toBeNull();
    expect(drawn.isDraw).toBe(true);
  });

  it('simultaneously wins a small board and the meta-game', () => {
    const boards = createInitialState().boards.map((b) => [...b]);
    boards[6] = ['X', 'X', null, null, null, null, null, null, null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      boards,
      boardResults: ['X', null, null, 'X', null, null, null, null, null],
      activeBoardIndex: 6,
      currentPlayer: 'X',
    };

    const won = play(state, 6, 2); // X wins board 6, column 0 meta win (0,3,6)
    expect(won.boardResults[6]).toBe('X');
    expect(won.winner).toBe('X');
  });

  it('sets activeBoardIndex to null when game is over', () => {
    const boards = createInitialState().boards.map((b) => [...b]);
    boards[2] = ['X', 'X', null, null, null, null, null, null, null] as CellValue[];

    const state: GameState = {
      ...createInitialState(),
      boards,
      boardResults: ['X', 'X', null, null, null, null, null, null, null],
      activeBoardIndex: 2,
      currentPlayer: 'X',
    };

    const won = play(state, 2, 2);
    expect(won.winner).toBe('X');
    expect(won.activeBoardIndex).toBeNull();
  });
});

describe('gameReducer — NEW_GAME', () => {
  it('returns a fresh initial state', () => {
    const state: GameState = {
      ...createInitialState(),
      winner: 'X',
    };
    const fresh = gameReducer(state, { type: 'NEW_GAME' });
    expect(fresh.winner).toBeNull();
    expect(fresh.isDraw).toBe(false);
    expect(fresh.currentPlayer).toBe('X');
    expect(fresh.activeBoardIndex).toBeNull();
    expect(fresh.boards.every((b) => b.every((c) => c === null))).toBe(true);
    expect(fresh.boardResults.every((r) => r === null)).toBe(true);
  });

  it('returns a new object (not the same reference)', () => {
    const s1 = gameReducer(createInitialState(), { type: 'NEW_GAME' });
    const s2 = gameReducer(createInitialState(), { type: 'NEW_GAME' });
    expect(s1).not.toBe(s2);
    expect(s1.boards).not.toBe(s2.boards);
    expect(s1.boards[0]).not.toBe(s2.boards[0]);
  });
});

describe('createInitialState', () => {
  it('returns new object each call (no shared refs)', () => {
    const a = createInitialState();
    const b = createInitialState();
    expect(a).not.toBe(b);
    expect(a.boards).not.toBe(b.boards);
    expect(a.boards[0]).not.toBe(b.boards[0]);
    expect(a.boardResults).not.toBe(b.boardResults);
  });

  it('has 9 boards, each with 9 null cells', () => {
    const state = createInitialState();
    expect(state.boards).toHaveLength(9);
    for (const board of state.boards) {
      expect(board).toHaveLength(9);
      expect(board.every((c) => c === null)).toBe(true);
    }
  });

  it('has correct initial values', () => {
    const state = createInitialState();
    expect(state.boardResults).toHaveLength(9);
    expect(state.boardResults.every((r) => r === null)).toBe(true);
    expect(state.activeBoardIndex).toBeNull();
    expect(state.currentPlayer).toBe('X');
    expect(state.winner).toBeNull();
    expect(state.isDraw).toBe(false);
  });
});
