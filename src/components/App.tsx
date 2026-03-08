import { GameStatus } from './GameStatus.tsx';
import { MetaBoard } from './MetaBoard.tsx';
import { Controls } from './Controls.tsx';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <a href="#game-board" className="sr-only">
        Skip to game board
      </a>
      <h1 className={styles.title}>Ultimate Tic-Tac-Toe</h1>
      <GameStatus />
      <main id="game-board">
        <MetaBoard />
      </main>
      <Controls />
    </div>
  );
}
