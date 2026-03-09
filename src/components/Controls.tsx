import styles from './Controls.module.css'
import { useGameStore } from '../store/gameStore.ts'

export default function Controls() {
  const resetGame = useGameStore((s) => s.resetGame)

  return (
    <div className={styles.controls}>
      <button className={styles.newGameButton} onClick={resetGame} type="button">
        New Game
      </button>
    </div>
  )
}
