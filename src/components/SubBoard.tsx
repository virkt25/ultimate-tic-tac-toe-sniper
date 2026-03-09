import { useCallback, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import styles from './SubBoard.module.css'
import Cell from './Cell.tsx'
import WinOverlay from './WinOverlay.tsx'
import { useGameStore } from '../store/gameStore.ts'
import { TOTAL_CELLS } from '../engine/constants.ts'

interface SubBoardProps {
  boardIndex: number
  isWinningBoard: boolean
}

export default function SubBoard({ boardIndex, isWinningBoard }: SubBoardProps) {
  const outcome = useGameStore((s) => s.game.subBoardOutcomes[boardIndex])
  const activeBoard = useGameStore((s) => s.game.activeBoard)
  const gameStatus = useGameStore((s) => s.game.status)
  const gridRef = useRef<HTMLDivElement>(null)

  const isActive =
    gameStatus === 'playing' && outcome === null && (activeBoard === null || activeBoard === boardIndex)
  const isDimmed = gameStatus === 'playing' && !isActive
  const isDrawn = outcome === 'draw'

  const handleArrowNav = useCallback(
    (cellIndex: number, key: string) => {
      const row = Math.floor(cellIndex / 3)
      const col = cellIndex % 3
      let targetRow = row
      let targetCol = col

      if (key === 'ArrowUp') targetRow = Math.max(0, row - 1)
      else if (key === 'ArrowDown') targetRow = Math.min(2, row + 1)
      else if (key === 'ArrowLeft') targetCol = Math.max(0, col - 1)
      else if (key === 'ArrowRight') targetCol = Math.min(2, col + 1)

      const targetIndex = targetRow * 3 + targetCol
      if (targetIndex !== cellIndex && gridRef.current) {
        const buttons = gridRef.current.querySelectorAll('button')
        buttons[targetIndex]?.focus()
      }
    },
    [],
  )

  return (
    <div
      className={`${styles.subBoard} ${isActive ? styles.active : ''} ${isDimmed ? styles.dimmed : ''} ${isDrawn ? styles.drawn : ''} ${isWinningBoard ? styles.winning : ''}`}
      role="group"
      aria-label={`Sub-board ${boardIndex + 1}${outcome === 'draw' ? ', drawn' : outcome ? `, won by ${outcome}` : ''}`}
    >
      <div className={styles.grid} ref={gridRef}>
        {Array.from({ length: TOTAL_CELLS }, (_, i) => (
          <Cell
            key={i}
            boardIndex={boardIndex}
            cellIndex={i}
            isActive={isActive}
            onArrowNav={handleArrowNav}
          />
        ))}
      </div>
      <AnimatePresence>
        {outcome && outcome !== 'draw' && <WinOverlay winner={outcome} />}
      </AnimatePresence>
    </div>
  )
}
