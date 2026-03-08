import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { createInitialState } from '../engine/engine';
import type { GameState } from '../engine/types';

function getGameState(): GameState {
  const s = useGameStore.getState();
  return {
    board: s.board,
    subBoardStatus: s.subBoardStatus,
    currentPlayer: s.currentPlayer,
    activeSubBoard: s.activeSubBoard,
    lastMove: s.lastMove,
    gameOutcome: s.gameOutcome,
    moveCount: s.moveCount,
  };
}

beforeEach(() => {
  useGameStore.getState().reset();
});

describe('gameStore', () => {
  it('initial state matches createInitialState()', () => {
    expect(getGameState()).toEqual(createInitialState());
  });

  it('playMove dispatches to engine and updates store', () => {
    useGameStore.getState().play(0, 4);

    const state = useGameStore.getState();
    expect(state.board[0][4]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.moveCount).toBe(1);
    expect(state.lastMove).toEqual({ subBoard: 0, cell: 4 });
    expect(state.activeSubBoard).toBe(4);
  });

  it('resetGame returns to initial state', () => {
    useGameStore.getState().play(0, 4);
    useGameStore.getState().play(4, 0);
    expect(useGameStore.getState().moveCount).toBe(2);

    useGameStore.getState().reset();

    expect(getGameState()).toEqual(createInitialState());
  });

  it('invalid move does not change state', () => {
    useGameStore.getState().play(0, 4); // X plays, sends to sub-board 4
    const stateAfterFirst = getGameState();

    // Try to play in sub-board 0 when constrained to sub-board 4
    useGameStore.getState().play(0, 0);

    expect(getGameState()).toEqual(stateAfterFirst);
  });
});
