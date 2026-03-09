import { useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import styles from './Cell.module.css'
import { useGameStore } from '../store/gameStore.ts'
import type { Player } from '../engine/types.ts'

interface CellProps {
  boardIndex: number
  cellIndex: number
  isActive: boolean
  onArrowNav: (cellIndex: number, key: string) => void
}

export default function Cell({ boardIndex, cellIndex, isActive, onArrowNav }: CellProps) {
  const cellValue = useGameStore((s) => s.game.boards[boardIndex][cellIndex])
  const playMove = useGameStore((s) => s.playMove)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const row = Math.floor(cellIndex / 3)
  const col = cellIndex % 3

  const handleClick = useCallback(() => {
    playMove(boardIndex, cellIndex)
  }, [playMove, boardIndex, cellIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        onArrowNav(cellIndex, e.key)
      }
    },
    [cellIndex, onArrowNav],
  )

  const isEmpty = cellValue === null
  const tabIndex = isActive && isEmpty ? 0 : -1

  return (
    <button
      ref={buttonRef}
      className={`${styles.cell} ${cellValue ? styles[`cell${cellValue}`] : ''} ${isActive && isEmpty ? styles.cellPlayable : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      aria-label={`Board ${boardIndex + 1}, Row ${row + 1}, Column ${col + 1}, ${cellValue ?? 'empty'}`}
      disabled={!isActive || !isEmpty}
    >
      {cellValue && <Mark player={cellValue} />}
    </button>
  )
}

function Mark({ player }: { player: Player }) {
  return (
    <motion.span
      className={styles.mark}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      aria-hidden
    >
      {player}
    </motion.span>
  )
}
