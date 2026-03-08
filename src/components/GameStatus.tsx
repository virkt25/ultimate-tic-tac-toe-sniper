import type { GameState } from '../engine/types';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  state: GameState;
}

export function GameStatus({ state }: GameStatusProps) {
  const { gameOutcome, currentPlayer } = state;

  if (gameOutcome?.result === 'win') {
    const winner = gameOutcome.winner;
    return (
      <div
        className={`${styles.status} ${styles.gameOver}`}
        role="status"
        aria-live="polite"
      >
        <span className={`${styles.playerBadge} ${winner === 'X' ? styles.badgeX : styles.badgeO}`}>
          {winner}
        </span>
        <span className={styles.message}>wins the game!</span>
      </div>
    );
  }

  if (gameOutcome?.result === 'draw') {
    return (
      <div
        className={`${styles.status} ${styles.draw}`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.message}>Game ended in a draw</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.status} ${currentPlayer === 'X' ? styles.turnX : styles.turnO}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`${styles.playerBadge} ${currentPlayer === 'X' ? styles.badgeX : styles.badgeO}`}
      >
        {currentPlayer}
      </span>
      <span className={styles.message}>to play</span>
    </div>
  );
}
