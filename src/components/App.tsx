import styles from './App.module.css'
import GameStatus from './GameStatus.tsx'
import MetaBoard from './MetaBoard.tsx'
import Controls from './Controls.tsx'

export default function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Ultimate Tic Tac Toe</h1>
      <GameStatus />
      <MetaBoard />
      <Controls />
    </div>
  )
}
