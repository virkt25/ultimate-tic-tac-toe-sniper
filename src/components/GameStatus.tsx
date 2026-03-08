import { useGameStore } from '../store/gameStore.ts';
import styles from './GameStatus.module.css';

export function GameStatus() {
  const currentPlayer = useGameStore((s) => s.currentPlayer);
  const gameOutcome = useGameStore((s) => s.gameOutcome);

  let message: string;
  let statusClass = styles.status;

  if (gameOutcome !== null) {
    if (gameOutcome.result === 'win') {
      message = `Player ${gameOutcome.winner} wins!`;
      statusClass += ` ${gameOutcome.winner === 'X' ? styles.winX : styles.winO}`;
    } else {
      message = "It's a draw!";
      statusClass += ` ${styles.draw}`;
    }
  } else {
    message = `Player ${currentPlayer}'s turn`;
    statusClass += ` ${currentPlayer === 'X' ? styles.turnX : styles.turnO}`;
  }

  return (
    <div className={statusClass} aria-live="polite" role="status">
      <span className={styles.indicator}>
        {gameOutcome === null && (
          <span
            className={`${styles.dot} ${currentPlayer === 'X' ? styles.dotX : styles.dotO}`}
          />
        )}
        {message}
      </span>
    </div>
  );
}
