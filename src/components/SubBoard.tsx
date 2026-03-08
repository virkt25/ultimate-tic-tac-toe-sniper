import type { SubBoardIndex, CellIndex } from '../engine/types.ts';
import { useGameStore } from '../store/gameStore.ts';
import { POSITION_LABELS } from '../engine/constants.ts';
import { Cell } from './Cell.tsx';
import styles from './SubBoard.module.css';

interface SubBoardProps {
  index: SubBoardIndex;
}

export function SubBoard({ index }: SubBoardProps) {
  const status = useGameStore((s) => s.subBoardStatus[index]);
  const validBoards = useGameStore((s) => s.getValidBoards());
  const gameOutcome = useGameStore((s) => s.gameOutcome);
  const isActive = gameOutcome === null && validBoards.includes(index);

  const classNames = [
    styles.subBoard,
    isActive ? styles.active : styles.inactive,
    status.result === 'won' ? styles.won : '',
    status.result === 'draw' ? styles.draw : '',
    status.result === 'won' && status.winner === 'X' ? styles.wonX : '',
    status.result === 'won' && status.winner === 'O' ? styles.wonO : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      role="group"
      aria-label={`Sub-board ${POSITION_LABELS[index]}${
        status.result === 'won' ? `, won by ${status.winner}` : ''
      }${status.result === 'draw' ? ', drawn' : ''}`}
    >
      <div className={styles.grid}>
        {Array.from({ length: 9 }, (_, i) => (
          <Cell key={i} subBoard={index} cell={i as CellIndex} />
        ))}
      </div>
      {status.result === 'won' && (
        <div className={styles.overlay} aria-hidden="true">
          <span className={status.winner === 'X' ? styles.overlayX : styles.overlayO}>
            {status.winner}
          </span>
        </div>
      )}
      {status.result === 'draw' && (
        <div className={`${styles.overlay} ${styles.overlayDraw}`} aria-hidden="true">
          <span className={styles.overlayDrawText}>-</span>
        </div>
      )}
    </div>
  );
}
