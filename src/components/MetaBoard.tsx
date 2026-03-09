import styles from './MetaBoard.module.css'
import SubBoard from './SubBoard.tsx'
import { useGameStore } from '../store/gameStore.ts'
import { TOTAL_BOARDS } from '../engine/constants.ts'

export default function MetaBoard() {
  const winningLine = useGameStore((s) => s.game.winningLine)
  const winningSet = winningLine ? new Set(winningLine) : null

  return (
    <div className={styles.metaBoard} role="grid" aria-label="Ultimate Tic Tac Toe board">
      {Array.from({ length: TOTAL_BOARDS }, (_, i) => (
        <SubBoard key={i} boardIndex={i} isWinningBoard={winningSet?.has(i) ?? false} />
      ))}
    </div>
  )
}
