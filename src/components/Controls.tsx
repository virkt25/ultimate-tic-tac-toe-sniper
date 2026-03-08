import { useGameStore } from '../store/gameStore.ts';
import styles from './Controls.module.css';

export function Controls() {
  const resetGame = useGameStore((s) => s.resetGame);
  const undoMove = useGameStore((s) => s.undoMove);
  const moveCount = useGameStore((s) => s.moveCount);

  return (
    <div className={styles.controls}>
      <button className={styles.button} onClick={undoMove} disabled={moveCount === 0} type="button">
        Undo
      </button>
      <button className={`${styles.button} ${styles.primary}`} onClick={resetGame} type="button">
        New Game
      </button>
    </div>
  );
}
