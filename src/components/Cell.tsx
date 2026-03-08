import type { CellValue } from '../engine/types';
import styles from './Cell.module.css';

interface CellProps {
  value: CellValue;
  isValid: boolean;
  isLastMove: boolean;
  currentPlayer: CellValue;
  subBoardRow: number;
  subBoardCol: number;
  cellRow: number;
  cellCol: number;
  onClick: () => void;
}

export function Cell({
  value,
  isValid,
  isLastMove,
  currentPlayer,
  subBoardRow,
  subBoardCol,
  cellRow,
  cellCol,
  onClick,
}: CellProps) {
  const cellClasses = [
    styles.cell,
    value === 'X' ? styles.x : value === 'O' ? styles.o : '',
    isValid ? styles.valid : styles.invalid,
    isLastMove ? styles.lastMove : '',
  ]
    .filter(Boolean)
    .join(' ');

  const posLabel = `Sub-board row ${subBoardRow + 1} column ${subBoardCol + 1}, cell row ${cellRow + 1} column ${cellCol + 1}`;
  const valueLabel = value ? value : 'empty';
  const statusLabel = isValid ? ', available' : '';

  return (
    <button
      className={cellClasses}
      onClick={onClick}
      disabled={!isValid}
      aria-label={`${posLabel}, ${valueLabel}${statusLabel}`}
      type="button"
    >
      {value ? (
        value
      ) : isValid ? (
        <span className={styles.hoverHint}>{currentPlayer}</span>
      ) : null}
    </button>
  );
}
