import type { CellIndex, CellValue, Player, SubBoardIndex, SubBoardStatus } from '../engine/types';
import { Cell } from './Cell';
import styles from './SubBoard.module.css';

interface SubBoardProps {
  index: SubBoardIndex;
  cells: CellValue[];
  status: SubBoardStatus;
  isActive: boolean;
  isFreeMove: boolean;
  currentPlayer: Player;
  lastMove: { subBoard: SubBoardIndex; cell: CellIndex } | null;
  isValidMove: (subBoard: SubBoardIndex, cell: CellIndex) => boolean;
  onCellClick: (subBoard: SubBoardIndex, cell: CellIndex) => void;
}

export function SubBoard({
  index,
  cells,
  status,
  isActive,
  isFreeMove,
  currentPlayer,
  lastMove,
  isValidMove,
  onCellClick,
}: SubBoardProps) {
  const subBoardRow = Math.floor(index / 3);
  const subBoardCol = index % 3;
  const isResolved = status.result !== 'playing';
  const isWon = status.result === 'won';
  const isDraw = status.result === 'draw';
  const isMuted = !isActive && !isResolved;

  const boardClasses = [
    styles.subBoard,
    isActive && !isResolved ? styles.active : '',
    isResolved ? styles.resolved : '',
    isMuted ? styles.muted : '',
    isDraw ? styles.drawBoard : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={boardClasses}
      role="group"
      aria-label={`Sub-board ${subBoardRow + 1}-${subBoardCol + 1}${isResolved ? `, ${isWon ? `won by ${status.winner}` : 'draw'}` : ''}${isActive && !isResolved ? (isFreeMove ? ', available (free move)' : ', active') : ''}`}
    >
      {cells.map((cell, cellIdx) => {
        const ci = cellIdx as CellIndex;
        const cellRow = Math.floor(cellIdx / 3);
        const cellCol = cellIdx % 3;
        const isLast =
          lastMove !== null &&
          lastMove.subBoard === index &&
          lastMove.cell === ci;

        return (
          <Cell
            key={cellIdx}
            value={cell}
            isValid={isValidMove(index, ci)}
            isLastMove={isLast}
            currentPlayer={currentPlayer}
            subBoardRow={subBoardRow}
            subBoardCol={subBoardCol}
            cellRow={cellRow}
            cellCol={cellCol}
            onClick={() => onCellClick(index, ci)}
          />
        );
      })}

      {isWon && (
        <div
          className={`${styles.overlay} ${status.winner === 'X' ? styles.wonX : styles.wonO}`}
          aria-hidden="true"
        >
          {status.winner === 'X' ? (
            <svg className={styles.overlaySymbol} viewBox="0 0 100 100" aria-hidden="true">
              <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className={styles.overlaySymbol} viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>
      )}

      {isDraw && (
        <div className={`${styles.overlay} ${styles.draw}`} aria-hidden="true">
          <span className={styles.drawText}>Draw</span>
        </div>
      )}
    </div>
  );
}
