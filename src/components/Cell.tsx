import type { CellValue, Player } from '../engine/types';
import styles from './Cell.module.css';

interface CellProps {
  value: CellValue;
  isValid: boolean;
  isLastMove: boolean;
  currentPlayer: Player;
  subBoardRow: number;
  subBoardCol: number;
  cellRow: number;
  cellCol: number;
  onClick: () => void;
}

function XSymbol({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <line x1="22" y1="22" x2="78" y2="78" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
      <line x1="78" y1="22" x2="22" y2="78" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

function OSymbol({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round" />
    </svg>
  );
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
      {value === 'X' ? (
        <XSymbol className={styles.symbol} />
      ) : value === 'O' ? (
        <OSymbol className={styles.symbol} />
      ) : isValid ? (
        <span className={styles.hoverHint}>
          {currentPlayer === 'X' ? (
            <XSymbol className={styles.symbol} />
          ) : (
            <OSymbol className={styles.symbol} />
          )}
        </span>
      ) : null}
    </button>
  );
}
