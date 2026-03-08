import type { SubBoardIndex } from '../engine/types.ts';
import { useGameStore } from '../store/gameStore.ts';
import { SubBoard } from './SubBoard.tsx';
import styles from './MetaBoard.module.css';

export function MetaBoard() {
  const winningLine = useGameStore((s) => s.getWinningLine());

  return (
    <div className={styles.metaBoard} role="grid" aria-label="Ultimate Tic-Tac-Toe board">
      <div className={styles.grid}>
        {Array.from({ length: 9 }, (_, i) => (
          <SubBoard key={i} index={i as SubBoardIndex} />
        ))}
      </div>
      {winningLine && <WinningLineOverlay line={winningLine} />}
    </div>
  );
}

function WinningLineOverlay({ line }: { line: readonly [number, number, number] }) {
  // Convert flat indices to row,col coordinates
  const coords = line.map((i) => ({
    row: Math.floor(i / 3),
    col: i % 3,
  }));

  // Calculate line positions as percentages
  const startX = (coords[0].col + 0.5) * (100 / 3);
  const startY = (coords[0].row + 0.5) * (100 / 3);
  const endX = (coords[2].col + 0.5) * (100 / 3);
  const endY = (coords[2].row + 0.5) * (100 / 3);

  return (
    <svg className={styles.winLine} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="var(--color-text)"
        strokeWidth="2"
        strokeLinecap="round"
        className={styles.winLineStroke}
      />
    </svg>
  );
}
