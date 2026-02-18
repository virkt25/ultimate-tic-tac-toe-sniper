import { describe, it, expect } from 'vitest';
import { WIN_PATTERNS, type Player, type BoardIndex, type CellIndex } from './types';

describe('Game Types', () => {
  describe('WIN_PATTERNS', () => {
    it('contains exactly 8 patterns', () => {
      expect(WIN_PATTERNS.length).toBe(8);
    });

    it('contains 3 row patterns', () => {
      const rows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ];
      rows.forEach((row) => {
        expect(WIN_PATTERNS).toContainEqual(row);
      });
    });

    it('contains 3 column patterns', () => {
      const columns = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ];
      columns.forEach((col) => {
        expect(WIN_PATTERNS).toContainEqual(col);
      });
    });

    it('contains 2 diagonal patterns', () => {
      const diagonals = [
        [0, 4, 8],
        [2, 4, 6],
      ];
      diagonals.forEach((diag) => {
        expect(WIN_PATTERNS).toContainEqual(diag);
      });
    });
  });

  describe('Type safety', () => {
    it('Player type only accepts X or O', () => {
      const playerX: Player = 'X';
      const playerO: Player = 'O';
      expect(playerX).toBe('X');
      expect(playerO).toBe('O');
    });

    it('BoardIndex type only accepts 0-8', () => {
      const validIndices: BoardIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(validIndices).toHaveLength(9);
    });

    it('CellIndex type only accepts 0-8', () => {
      const validIndices: CellIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(validIndices).toHaveLength(9);
    });
  });
});
