import styles from './Controls.module.css';

interface ControlsProps {
  onNewGame: () => void;
  isGameOver?: boolean;
}

export function Controls({ onNewGame, isGameOver = false }: ControlsProps) {
  const btnClasses = [
    styles.newGameBtn,
    isGameOver ? styles.emphasized : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.controls}>
      <button className={btnClasses} onClick={onNewGame} type="button">
        New Game
      </button>
    </div>
  );
}
