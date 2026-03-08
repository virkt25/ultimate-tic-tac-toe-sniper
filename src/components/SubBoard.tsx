import type { CellIndex, CellValue, Player, SubBoardIndex, SubBoardStatus } from '../engine/types';
import { Cell } from './Cell';
import styles from './SubBoard.module.css';

interface SubBoardProps {
  index: SubBoardIndex;
  cells: CellValue[];
  status: SubBoardStatus;
  isActive: boolean;
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
  currentPlayer,
  lastMove,
  isValidMove,
  onCellClick,
}: SubBoardProps) {
  const subBoardRow = Math.floor(index / 3);
  const subBoardCol = index % 3;
  const isResolved = status.result !== 'playing';

  const boardClasses = [
    styles.subBoard,
    isActive && !isResolved ? styles.active : '',
    isResolved ? styles.resolved : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={boardClasses}
      role="group"
      aria-label={`Sub-board ${subBoardRow + 1}-${subBoardCol + 1}${isResolved ? `, ${status.result === 'won' ? `won by ${status.winner}` : 'draw'}` : ''}`}
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

      {status.result === 'won' && (
        <div
          className={`${styles.overlay} ${status.winner === 'X' ? styles.wonX : styles.wonO}`}
        >
          {status.winner}
        </div>
      )}

      {status.result === 'draw' && (
        <div className={`${styles.overlay} ${styles.draw}`}>
          <span className={styles.drawText}>Draw</span>
        </div>
      )}
    </div>
  );
}
