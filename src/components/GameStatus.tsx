import { AnimatePresence, motion } from 'motion/react'
import styles from './GameStatus.module.css'
import { useGameStore } from '../store/gameStore.ts'

export default function GameStatus() {
  const status = useGameStore((s) => s.game.status)
  const currentPlayer = useGameStore((s) => s.game.currentPlayer)
  const winner = useGameStore((s) => s.game.winner)

  let message: string
  let colorClass = ''

  if (status === 'won' && winner) {
    message = `Player ${winner} Wins!`
    colorClass = winner === 'X' ? styles.colorX : styles.colorO
  } else if (status === 'draw') {
    message = "It's a Draw!"
  } else {
    message = `Player ${currentPlayer}'s Turn`
    colorClass = currentPlayer === 'X' ? styles.colorX : styles.colorO
  }

  return (
    <div className={styles.statusContainer} aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          className={`${styles.status} ${colorClass} ${status === 'won' ? styles.celebration : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
