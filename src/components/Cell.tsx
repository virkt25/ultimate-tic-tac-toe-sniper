import type { SubBoardIndex, CellIndex } from '../engine/types.ts';
import { useGameStore } from '../store/gameStore.ts';
import { POSITION_LABELS } from '../engine/constants.ts';
import styles from './Cell.module.css';

interface CellProps {
  subBoard: SubBoardIndex;
  cell: CellIndex;
}

export function Cell({ subBoard, cell }: CellProps) {
  const value = useGameStore((s) => s.board[subBoard][cell]);
  const isValid = useGameStore((s) => s.isValidMove(subBoard, cell));
  const isLastMove = useGameStore(
    (s) => s.lastMove?.subBoard === subBoard && s.lastMove?.cell === cell,
  );
  const makeMove = useGameStore((s) => s.makeMove);

  const classNames = [
    styles.cell,
    value === 'X' ? styles.x : '',
    value === 'O' ? styles.o : '',
    isValid ? styles.valid : '',
    isLastMove ? styles.lastMove : '',
  ]
    .filter(Boolean)
    .join(' ');

  const subBoardLabel = POSITION_LABELS[subBoard];
  const cellLabel = POSITION_LABELS[cell];
  const valueLabel = value ?? 'empty';
  const ariaLabel = `Sub-board ${subBoardLabel}, cell ${cellLabel}, ${valueLabel}${isValid ? ', available' : ''}`;

  return (
    <button
      className={classNames}
      onClick={() => isValid && makeMove(subBoard, cell)}
      disabled={!isValid}
      aria-label={ariaLabel}
      type="button"
    >
      {value && <span className={styles.mark}>{value}</span>}
    </button>
  );
}
