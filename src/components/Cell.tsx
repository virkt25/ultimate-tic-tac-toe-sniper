import { useState, useCallback } from 'react';
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
  const [shaking, setShaking] = useState(false);

  const cellClasses = [
    styles.cell,
    value === 'X' ? styles.x : value === 'O' ? styles.o : '',
    isValid ? styles.valid : styles.invalid,
    isLastMove ? styles.lastMove : '',
    shaking ? styles.shake : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = useCallback(() => {
    if (isValid) {
      onClick();
    } else if (!value) {
      // Only shake empty invalid cells (not already-placed marks)
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
    }
  }, [isValid, value, onClick]);

  const posLabel = `Sub-board row ${subBoardRow + 1} column ${subBoardCol + 1}, cell row ${cellRow + 1} column ${cellCol + 1}`;
  const valueLabel = value ? value : 'empty';
  const statusLabel = isValid ? ', available' : '';

  const hoverHintClass = [
    styles.hoverHint,
    currentPlayer === 'X' ? styles.hoverHintX : styles.hoverHintO,
  ].join(' ');

  return (
    <button
      className={cellClasses}
      onClick={handleClick}
      aria-disabled={!isValid}
      aria-label={`${posLabel}, ${valueLabel}${statusLabel}`}
      type="button"
    >
      {value ? (
        value
      ) : isValid ? (
        <span className={hoverHintClass}>{currentPlayer}</span>
      ) : null}
    </button>
  );
}
