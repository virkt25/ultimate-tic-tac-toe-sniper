import { useRef, useCallback, type KeyboardEvent } from 'react';
import type { CellIndex, GameState, SubBoardIndex } from '../engine/types';
import { isValidMove as checkValid, findWinningPattern } from '../engine/engine';
import { SubBoard } from './SubBoard';
import styles from './MetaBoard.module.css';

interface MetaBoardProps {
  state: GameState;
  onCellClick: (subBoard: SubBoardIndex, cell: CellIndex) => void;
}

/** Map a winning pattern index (0-8) to center coordinates in percentage */
function getPatternEndpoints(pattern: readonly [number, number, number]) {
  const coords = pattern.map((idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    return {
      x: ((col + 0.5) / 3) * 100,
      y: ((row + 0.5) / 3) * 100,
    };
  });
  return { start: coords[0], end: coords[2] };
}

export function MetaBoard({ state, onCellClick }: MetaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const isSubBoardActive = (idx: SubBoardIndex): boolean => {
    if (state.gameOutcome !== null) return false;
    if (state.subBoardStatus[idx].result !== 'playing') return false;
    return state.activeSubBoard === null || state.activeSubBoard === idx;
  };

  const checkValidMove = (subBoard: SubBoardIndex, cell: CellIndex): boolean => {
    return checkValid(state, subBoard, cell);
  };

  const focusCell = useCallback((flat: number) => {
    if (!boardRef.current) return;
    const buttons = boardRef.current.querySelectorAll('button');
    if (flat >= 0 && flat < buttons.length) {
      (buttons[flat] as HTMLElement).focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'BUTTON') return;

      const buttons = boardRef.current?.querySelectorAll('button');
      if (!buttons) return;

      const currentIndex = Array.from(buttons).indexOf(target as HTMLButtonElement);
      if (currentIndex === -1) return;

      const row = Math.floor(currentIndex / 9);
      const col = currentIndex % 9;

      let nextFlat = currentIndex;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          nextFlat = row > 0 ? (row - 1) * 9 + col : currentIndex;
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextFlat = row < 8 ? (row + 1) * 9 + col : currentIndex;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextFlat = col > 0 ? row * 9 + (col - 1) : currentIndex;
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextFlat = col < 8 ? row * 9 + (col + 1) : currentIndex;
          break;
        default:
          return;
      }

      if (nextFlat !== currentIndex) {
        focusCell(nextFlat);
      }
    },
    [focusCell],
  );

  const winPattern =
    state.gameOutcome?.result === 'win' ? findWinningPattern(state.subBoardStatus) : null;

  return (
    <div
      className={styles.metaBoard}
      role="grid"
      aria-label="Ultimate Tic-Tac-Toe board"
      ref={boardRef}
      onKeyDown={handleKeyDown}
    >
      {state.board.map((cells, idx) => (
        <SubBoard
          key={idx}
          index={idx as SubBoardIndex}
          cells={cells}
          status={state.subBoardStatus[idx]}
          isActive={isSubBoardActive(idx as SubBoardIndex)}
          currentPlayer={state.currentPlayer}
          lastMove={state.lastMove}
          isValidMove={checkValidMove}
          onCellClick={onCellClick}
        />
      ))}

      {winPattern && (
        <svg
          className={styles.winLine}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          {(() => {
            const { start, end } = getPatternEndpoints(winPattern);
            const winner = state.gameOutcome?.result === 'win' ? state.gameOutcome.winner : 'X';
            const color = winner === 'X' ? '#60a5fa' : '#f472b6';
            return (
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={color}
                strokeWidth="2"
                strokeOpacity="0.8"
              />
            );
          })()}
        </svg>
      )}
    </div>
  );
}
