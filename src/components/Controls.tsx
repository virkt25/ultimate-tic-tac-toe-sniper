import styles from './Controls.module.css';

interface ControlsProps {
  onNewGame: () => void;
}

export function Controls({ onNewGame }: ControlsProps) {
  return (
    <div className={styles.controls}>
      <button className={styles.newGameBtn} onClick={onNewGame} type="button">
        New Game
      </button>
    </div>
  );
}
