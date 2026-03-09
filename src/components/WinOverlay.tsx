import { motion } from 'motion/react'
import styles from './WinOverlay.module.css'
import type { Player } from '../engine/types.ts'

interface WinOverlayProps {
  winner: Player
}

export default function WinOverlay({ winner }: WinOverlayProps) {
  return (
    <motion.div
      className={`${styles.overlay} ${styles[`overlay${winner}`]}`}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className={styles.symbol}>{winner}</span>
    </motion.div>
  )
}
