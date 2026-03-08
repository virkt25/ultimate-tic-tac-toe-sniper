import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore.ts';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should start with initial state', () => {
    const state = useGameStore.getState();
    expect(state.currentPlayer).toBe('X');
    expect(state.moveCount).toBe(0);
    expect(state.gameOutcome).toBeNull();
  });

  it('should make a move and update state', () => {
    useGameStore.getState().makeMove(4, 4);
    const state = useGameStore.getState();
    expect(state.board[4][4]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.activeSubBoard).toBe(4);
    expect(state.moveCount).toBe(1);
  });

  it('should reset the game', () => {
    useGameStore.getState().makeMove(0, 0);
    useGameStore.getState().resetGame();
    const state = useGameStore.getState();
    expect(state.moveCount).toBe(0);
    expect(state.board[0][0]).toBeNull();
  });

  it('should undo a move', () => {
    useGameStore.getState().makeMove(4, 4);
    useGameStore.getState().makeMove(4, 0);
    useGameStore.getState().undoMove();
    const state = useGameStore.getState();
    expect(state.moveCount).toBe(1);
    expect(state.board[4][0]).toBeNull();
    expect(state.currentPlayer).toBe('O');
  });

  it('should validate moves correctly', () => {
    useGameStore.getState().makeMove(0, 4);
    const state = useGameStore.getState();
    expect(state.isValidMove(4, 0)).toBe(true);
    expect(state.isValidMove(0, 0)).toBe(false);
  });
});
